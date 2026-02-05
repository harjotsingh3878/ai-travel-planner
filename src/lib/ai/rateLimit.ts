/**
 * Rate limiting and token quota for AI requests.
 * Uses in-memory store for single-instance; use Redis for multi-instance.
 */

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_HOUR = parseInt(process.env.AI_RATE_LIMIT_PER_HOUR || '30', 10);

/**
 * Check if user is over request rate limit. Returns true if allowed.
 */
export function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = `ai:${userId}`;
  let entry = requestCounts.get(key);

  if (!entry) {
    requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    requestCounts.set(key, entry);
    return { allowed: true };
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true };
}

const DAILY_TOKEN_QUOTA = parseInt(process.env.AI_DAILY_TOKEN_QUOTA_PER_USER || '500000', 10);

/**
 * Check if user has exceeded daily token quota. Requires getTokenUsageInWindow from tokenTracking.
 */
export async function checkTokenQuota(
  userId: string,
  getTokenUsageInWindow: (userId: string, since: Date) => Promise<{ totalTokens: number }>
): Promise<{ allowed: boolean }> {
  const since = new Date();
  since.setDate(since.getDate() - 1);
  const { totalTokens } = await getTokenUsageInWindow(userId, since);
  return { allowed: totalTokens < DAILY_TOKEN_QUOTA };
}

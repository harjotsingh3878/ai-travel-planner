import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG } from './config';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface LLMResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  provider: 'openai' | 'gemini';
  model: string;
}

export async function callOpenAI(
  systemPrompt: string,
  userMessage: string
): Promise<LLMResponse> {
  const completion = await openai.chat.completions.create({
    model: AI_CONFIG.openai.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: AI_CONFIG.openai.temperature,
    max_tokens: AI_CONFIG.openai.maxTokens,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No content in OpenAI response');

  const usage = completion.usage;
  return {
    content,
    inputTokens: usage?.prompt_tokens ?? 0,
    outputTokens: usage?.completion_tokens ?? 0,
    provider: 'openai',
    model: AI_CONFIG.openai.model,
  };
}

export async function callGemini(
  systemPrompt: string,
  userMessage: string
): Promise<LLMResponse> {
  const fullPrompt = `${systemPrompt}\n\n${userMessage}\n\nIMPORTANT: Return ONLY valid JSON, no markdown or explanations.`;
  const model = genAI.getGenerativeModel({ model: AI_CONFIG.gemini.model });
  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  const text = response.text();

  if (!text) throw new Error('No content in Gemini response');

  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');

  const usage = (response as { usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } }).usageMetadata;
  const inputTokens = usage?.promptTokenCount ?? 0;
  const outputTokens = usage?.candidatesTokenCount ?? 0;

  return {
    content: cleaned,
    inputTokens,
    outputTokens,
    provider: 'gemini',
    model: AI_CONFIG.gemini.model,
  };
}

export async function callLLM(
  provider: 'openai' | 'gemini',
  systemPrompt: string,
  userMessage: string
): Promise<LLMResponse> {
  if (provider === 'openai') {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured');
    return callOpenAI(systemPrompt, userMessage);
  }
  if (provider === 'gemini') {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured');
    return callGemini(systemPrompt, userMessage);
  }
  throw new Error(`Unsupported provider: ${provider}`);
}

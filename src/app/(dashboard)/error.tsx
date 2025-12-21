'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console but don't show UI for Recharts style warnings
    if (error.message.includes('style` prop expects')) {
      console.warn('Recharts style warning (non-critical):', error.message);
    } else {
      console.error('Error:', error);
    }
  }, [error]);

  // Don't show error UI for Recharts style warnings
  if (error.message.includes('style` prop expects')) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

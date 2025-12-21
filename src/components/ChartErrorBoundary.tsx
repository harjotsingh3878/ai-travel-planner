'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Check if it's the Recharts style warning
    if (error.message && error.message.includes('style` prop expects')) {
      // Don't treat it as an error
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Only log non-Recharts errors
    if (!error.message.includes('style` prop expects')) {
      console.error('Chart error:', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8 text-gray-600">
          Unable to load charts
        </div>
      );
    }

    return this.props.children;
  }
}

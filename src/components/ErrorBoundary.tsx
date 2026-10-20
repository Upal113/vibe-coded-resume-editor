import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackResume?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PushResume caught unhandled UI error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.fallbackResume) {
      this.props.fallbackResume();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white">Something interrupted the view</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              An unexpected data formatting issue occurred while rendering the document. Your editor session can be restored immediately.
            </p>
            {this.state.error && (
              <pre className="text-[11px] font-mono bg-black/50 p-2.5 rounded-lg text-rose-300 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Stable Template</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
                    <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Something went wrong
                        </h2>
                        <p className="text-gray-600 mb-6">
                            An unexpected error occurred in the application.
                        </p>

                        <details className="whitespace-pre-wrap text-left bg-gray-100 p-4 rounded-lg text-xs font-mono text-gray-700 overflow-auto max-h-64 border border-gray-300">
                            <summary className="cursor-pointer font-semibold mb-2 text-gray-600">Error Details</summary>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
                            >
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

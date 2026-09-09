import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere below it in the tree and shows a
 * readable message instead of an unexplained blank page. React only logs
 * these to the console by default, which is easy to miss.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("Recipe Vault crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background: "#1b1815",
            color: "#f3eee4",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <h1 style={{ marginBottom: "0.5rem" }}>Something went wrong</h1>
            <p style={{ color: "#a89d8c", marginBottom: "1rem" }}>
              {this.state.error.message}
            </p>
            <p style={{ color: "#a89d8c", fontSize: "0.85rem" }}>
              Check the browser console (F12) for the full error, and see
              README.md for setup steps.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

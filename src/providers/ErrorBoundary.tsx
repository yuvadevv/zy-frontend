"use client";
import * as React from "react";
import { UnknownErrorScreen } from "@/features/bootstrap/components/UnknownErrorScreen";
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return <UnknownErrorScreen error={this.state.error} />;
    return this.props.children;
  }
}
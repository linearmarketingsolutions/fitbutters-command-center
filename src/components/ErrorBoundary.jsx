import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-red)' }}>
          Something went wrong. Refresh to try again.
        </div>
      )
    }
    return this.props.children
  }
}

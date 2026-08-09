import { Component } from 'react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Prism crashed:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h1 className="error-boundary__title">Something went wrong</h1>
          <p className="error-boundary__text">Prism hit an unexpected error. Try resetting the page.</p>
          <button type="button" className="error-boundary__reset" onClick={this.handleReset}>
            Reset
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

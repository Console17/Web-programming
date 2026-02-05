import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          fontFamily: 'Beatrice Deck Trial, serif',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          margin: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page to continue.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.8rem 1.5rem',
              marginTop: '1rem',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'Beatrice Deck Trial, serif',
              letterSpacing: '1px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
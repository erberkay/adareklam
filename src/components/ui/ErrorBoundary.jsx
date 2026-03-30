import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a0a0a', color: '#f5f5f5', padding: '2rem', textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
        }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '2rem', marginBottom: '1rem', color: '#c8a45c' }}>
            Ada Reklamcılık
          </h1>
          <p style={{ color: '#a0a0a0', marginBottom: '1.5rem' }}>
            Sayfa yüklenirken bir hata oluştu.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 28px', borderRadius: '50px', background: '#c8a45c', border: 'none', color: '#000', fontWeight: 600, cursor: 'pointer' }}
          >
            Yenile
          </button>
          {import.meta.env.DEV && (
            <pre style={{ marginTop: '2rem', color: '#ef4444', fontSize: '0.75rem', textAlign: 'left', maxWidth: '600px', overflow: 'auto' }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

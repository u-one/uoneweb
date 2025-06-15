import React from 'react';

interface FeaturePanelProps {
  features: any[];
  onClose: () => void;
}

export const FeaturePanel: React.FC<FeaturePanelProps> = ({ features, onClose }) => {
  return (
    <div style={{
      width: '350px',
      height: 'calc(100vh - 200px)',
      backgroundColor: '#ffffff',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '1rem',
      overflow: 'auto',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0 0 1rem 0',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '0.5rem'
      }}>
        <h3 style={{
          margin: '0',
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#2c3e50'
        }}>
          フィーチャー情報 ({features.length})
        </h3>
        <button
          onClick={onClose}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#c82333';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#dc3545';
          }}
        >
          ✕
        </button>
      </div>

      {features.length === 0 ? (
        <p style={{
          color: '#6c757d',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '2rem 0'
        }}>
          フィーチャーが見つかりません
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '0.75rem',
                fontSize: '0.9rem'
              }}
            >
              <div style={{
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '0.5rem',
                borderBottom: '1px solid #dee2e6',
                paddingBottom: '0.25rem'
              }}>
                レイヤー: {feature.layer?.id || 'Unknown'}
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                  タイプ: {feature.geometry?.type || 'Unknown'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                  ソース: {feature.source || 'Unknown'}
                </div>
              </div>

              {feature.properties && Object.keys(feature.properties).length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#495057',
                    marginBottom: '0.5rem'
                  }}>
                    プロパティ:
                  </div>
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}>
                    {Object.entries(feature.properties).map(([key, value]) => (
                      <div key={key} style={{
                        display: 'flex',
                        marginBottom: '0.25rem',
                        fontSize: '0.8rem'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#495057',
                          minWidth: '80px',
                          marginRight: '0.5rem'
                        }}>
                          {key}:
                        </span>
                        <span style={{
                          color: '#2c3e50',
                          wordBreak: 'break-all',
                          fontFamily: typeof value === 'string' ? 'inherit' : 'monospace'
                        }}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

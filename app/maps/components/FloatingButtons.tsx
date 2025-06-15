import React from 'react';

interface FloatingButtonsProps {
  onLayersClick: () => void;
  onFeaturesClick?: () => void;
  showFeaturesButton: boolean;
  layersCount: number;
  featuresCount: number;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  onLayersClick,
  onFeaturesClick,
  showFeaturesButton,
  layersCount,
  featuresCount
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      left: '1rem',
      zIndex: 500,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      {/* レイヤーボタン */}
      <button
        onClick={onLayersClick}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          color: '#495057',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fa';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>📋</div>
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: '600',
          color: '#6c757d'
        }}>
          {layersCount}
        </div>
      </button>

      {/* フィーチャー情報ボタン */}
      {showFeaturesButton && onFeaturesClick && (
        <button
          onClick={onFeaturesClick}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            color: 'white',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>ℹ️</div>
          <div style={{ 
            fontSize: '0.7rem', 
            fontWeight: '600'
          }}>
            {featuresCount}
          </div>
        </button>
      )}
    </div>
  );
};

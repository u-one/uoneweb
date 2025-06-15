import React from 'react';
import { LayerInfo } from '../hooks/useMapState';

interface LayerPanelProps {
  layers: LayerInfo[];
  expandedLayers: Set<string>;
  allExpanded: boolean;
  onToggleLayerExpansion: (layerId: string) => void;
  onToggleAllExpansion: () => void;
  onToggleLayerVisibility: (layerId: string) => void;
  isModal?: boolean;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  expandedLayers,
  allExpanded,
  onToggleLayerExpansion,
  onToggleAllExpansion,
  onToggleLayerVisibility,
  isModal = false
}) => {
  const containerStyle = isModal ? {
    width: '100%',
    height: 'auto',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0',
    padding: '0',
    overflow: 'visible',
    boxShadow: 'none'
  } : {
    width: '300px',
    height: 'calc(100vh - 200px)',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '1rem',
    overflow: 'auto',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      {!isModal && (
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
            レイヤー一覧 ({layers.length})
          </h3>
          <button
          onClick={onToggleAllExpansion}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#5a6268';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#6c757d';
          }}
          >
            {allExpanded ? '全て折りたたみ' : '全て展開'}
          </button>
        </div>
      )}

      {/* モーダル用の全て展開/折りたたみボタン */}
      {isModal && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1rem'
        }}>
          <button
            onClick={onToggleAllExpansion}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {allExpanded ? '全て折りたたみ' : '全て展開'}
          </button>
        </div>
      )}

      {layers.length === 0 ? (
        <p style={{
          color: '#6c757d',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '2rem 0'
        }}>
          レイヤー情報を読み込み中...
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {layers.map((layer) => {
            const isExpanded = expandedLayers.has(layer.id);
            return (
              <div
                key={layer.id}
                style={{
                  backgroundColor: layer.visible ? '#f8f9fa' : '#e9ecef',
                  border: `1px solid ${layer.visible ? '#dee2e6' : '#ced4da'}`,
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden'
                }}
              >
                {/* ヘッダー部分（常に表示） */}
                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: isExpanded ? '1px solid #dee2e6' : 'none'
                  }}
                  onClick={() => onToggleLayerExpansion(layer.id)}
                >
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* 展開/折りたたみアイコン */}
                    <span style={{
                      fontSize: '0.8rem',
                      color: '#6c757d',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}>
                      ▶
                    </span>

                    {/* タイトルまたはID */}
                    <div style={{
                      fontWeight: '600',
                      color: layer.visible ? '#2c3e50' : '#6c757d',
                      fontSize: '0.85rem'
                    }}>
                      {layer.title || layer.id}
                    </div>
                  </div>

                  {/* 表示/非表示ボタン */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLayerVisibility(layer.id);
                    }}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                      backgroundColor: layer.visible ? '#28a745' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      minWidth: '50px'
                    }}
                  >
                    {layer.visible ? '表示' : '非表示'}
                  </button>
                </div>

                {/* 詳細部分（展開時のみ表示） */}
                {isExpanded && (
                  <div style={{ padding: '0.75rem' }}>
                    {/* レイヤーID（タイトルがある場合のみ表示） */}
                    {layer.title && (
                      <div style={{
                        fontWeight: '400',
                        color: '#6c757d',
                        marginBottom: '0.5rem',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace'
                      }}>
                        ID: {layer.id}
                      </div>
                    )}

                    {/* タイプとソース */}
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#6c757d',
                      backgroundColor: '#ffffff',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '4px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div><strong>タイプ:</strong> {layer.type}</div>
                      {layer.source && (
                        <div style={{ marginTop: '0.25rem' }}>
                          <strong>ソース:</strong> {layer.source}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

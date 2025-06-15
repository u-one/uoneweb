"use client";

import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useSearchParams, useRouter } from 'next/navigation';

// ラスタタイル用のスタイル定義
const createRasterStyle = (tileUrl: string, attribution: string = '') => ({
  version: 8 as const,
  sources: {
    'raster-tiles': {
      type: 'raster' as const,
      tiles: [tileUrl],
      tileSize: 256,
      attribution: attribution
    }
  },
  layers: [
    {
      id: 'raster-layer',
      type: 'raster' as const,
      source: 'raster-tiles'
    }
  ]
});

type StyleOption = {
  id: string;
  label: string;
  url?: string;
  style?: any;
};

const styles: StyleOption[] = [
  { id: 'maplibre-demo', label: 'MapLibre デモ', url: 'https://demotiles.maplibre.org/style.json' },
  { id: 'osm-bright-ja', label: 'osm-bright-ja', url: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json' },
  { id: 'osm-raster', label: 'OSM ラスタタイル', style: createRasterStyle('https://tile.openstreetmap.jp/{z}/{x}/{y}.png', '© OpenStreetMap contributors') },
  { id: 'rekichizu', label: 'れきちず', url: 'https://mierune.github.io/rekichizu-style/styles/street/style.json' },
  { id: 'gsi-standard', label: '地理院:標準地図', url: './gsi_standard_style.json' },
  { id: 'gsi-light', label: '地理院:軽い標準地図', url: './gsi_light_style.json' },
  { id: 'gsi-kana', label: '地理院:ひらがな地図', url: './gsi_kana_style.json' },
  { id: '', label: '', url: '' }

];

type LayerInfo = {
  id: string;
  type: string;
  source?: string;
  visible: boolean;
  title?: string;
};

export default function MapsPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // URLパラメータから初期値を取得
  const getInitialValues = () => {
    const styleId = searchParams.get('style');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const zoom = searchParams.get('zoom');

    // スタイルIDからインデックスを取得
    const styleIndex = styleId ? styles.findIndex(s => s.id === styleId) : -1;

    return {
      styleIndex: styleIndex >= 0 ? styleIndex : 0,
      center: {
        lat: lat ? parseFloat(lat) : 35.6812,
        lng: lng ? parseFloat(lng) : 139.7671
      },
      zoom: zoom ? parseFloat(zoom) : 10
    };
  };

  const initialValues = getInitialValues();
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(initialValues.styleIndex);
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [mapInfo, setMapInfo] = useState({
    center: initialValues.center,
    zoom: initialValues.zoom
  });
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [clickedFeatures, setClickedFeatures] = useState<any[]>([]);
  const [showFeaturePanel, setShowFeaturePanel] = useState(false);
  const clickMarkerRef = useRef<maplibregl.Marker | null>(null);

  // レイヤー情報を更新する関数
  const updateLayers = (map: maplibregl.Map) => {
    try {
      const style = map.getStyle()
      if (style && style.layers) {
        const layerInfos: LayerInfo[] = style.layers.map(layer => ({
          id: layer.id,
          type: layer.type,
          source: (layer as any).source || undefined,
          visible: map.getLayoutProperty(layer.id, 'visibility') !== 'none',
          title: (layer as any).metadata?.title || undefined
        }));
        setLayers(layerInfos);
      }
    } catch (error) {
      console.error('レイヤー情報の取得エラー:', error);
    }
  };

  // URLを更新する関数
  const updateURL = (styleIndex: number, center: { lat: number; lng: number }, zoom: number) => {
    const params = new URLSearchParams();
    params.set('style', styles[styleIndex].id);
    params.set('lat', center.lat.toFixed(6));
    params.set('lng', center.lng.toFixed(6));
    params.set('zoom', zoom.toFixed(2));

    const newURL = `${window.location.pathname}?${params.toString()}`;
    router.replace(newURL);
  };

  // 地図情報を更新する関数
  const updateMapInfo = (map: maplibregl.Map) => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const newMapInfo = {
      center: { lat: center.lat, lng: center.lng },
      zoom: zoom
    };
    setMapInfo(newMapInfo);

    // URLも更新
    updateURL(selectedStyleIndex, newMapInfo.center, newMapInfo.zoom);
  };

  // レイヤーの表示/非表示を切り替える関数
  const toggleLayerVisibility = (layerId: string) => {
    if (!mapRef.current) return;

    const currentVisibility = mapRef.current.getLayoutProperty(layerId, 'visibility');
    const newVisibility = currentVisibility === 'none' ? 'visible' : 'none';

    mapRef.current.setLayoutProperty(layerId, 'visibility', newVisibility);
    updateLayers(mapRef.current);
  };

  // レイヤーの展開/折りたたみを切り替える関数
  const toggleLayerExpansion = (layerId: string) => {
    setExpandedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  // 全て展開/折りたたみ
  const toggleAllExpansion = () => {
    if (allExpanded) {
      setExpandedLayers(new Set());
      setAllExpanded(false);
    } else {
      setExpandedLayers(new Set(layers.map(layer => layer.id)));
      setAllExpanded(true);
    }
  };

  // 地図クリック時のフィーチャー情報取得
  const handleMapClick = (map: maplibregl.Map, e: maplibregl.MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point);
    console.log('クリック位置のフィーチャー:', features);
    console.log('現在のclickMarker:', clickMarkerRef.current);
    setClickedFeatures(features);
    setShowFeaturePanel(features.length > 0);

    // 既存のマーカーを削除
    if (clickMarkerRef.current) {
      console.log('既存のマーカーを削除');
      clickMarkerRef.current.remove();
      clickMarkerRef.current = null;
    } else {
      console.log('削除するマーカーがありません');
    }

    // 新しいマーカーを追加（フィーチャーがある場合のみ）
    if (features.length > 0) {
      // カスタムマーカー要素を作成
      const markerElement = document.createElement('div');
      markerElement.style.width = '20px';
      markerElement.style.height = '20px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = '#ff4444';
      markerElement.style.border = '3px solid #ffffff';
      markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      markerElement.style.cursor = 'pointer';

      const marker = new maplibregl.Marker(markerElement)
        .setLngLat(e.lngLat)
        .addTo(map);

      console.log('新しいマーカーを作成:', e.lngLat);
      clickMarkerRef.current = marker;
    } else {
      // フィーチャーがない場合はマーカーも表示しない
      clickMarkerRef.current = null;
    }
  };

  // スタイル変更時にURLを更新
  const handleStyleChange = (newStyleIndex: number) => {
    setSelectedStyleIndex(newStyleIndex);
    updateURL(newStyleIndex, mapInfo.center, mapInfo.zoom);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const selectedStyle = styles[selectedStyleIndex]
    const styleToUse = selectedStyle.url || selectedStyle.style;

    // マップが既に存在する場合は削除して再作成
    if (mapRef.current) {
      console.log('既存のマップを削除してスタイルを切り替え:', selectedStyle.label);
      // 既存のマーカーも削除
      if (clickMarkerRef.current) {
        clickMarkerRef.current.remove();
        clickMarkerRef.current = null;
      }
      mapRef.current.remove();
      mapRef.current = null;
    }

    console.log('マップを初期化中:', selectedStyle.label);
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleToUse,
      center: [mapInfo.center.lng, mapInfo.center.lat],
      zoom: mapInfo.zoom,
    });

    map.on('load', () => {
      console.log('マップ読み込み完了:', selectedStyle.label);
      updateLayers(map);
      updateMapInfo(map);
    });

    map.on('style.load', () => {
      console.log('スタイル読み込み完了:', selectedStyle.label);
      updateLayers(map);
      updateMapInfo(map);
    });

    // 地図の移動やズーム時に情報を更新
    map.on('moveend', () => {
      updateMapInfo(map);
    });

    map.on('zoomend', () => {
      updateMapInfo(map);
    });

    // 地図クリック時のフィーチャー情報取得
    map.on('click', (e) => {
      handleMapClick(map, e);
    });

    map.on('error', (e) => {
      console.error('マップエラー:', e.error);
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedStyleIndex]);

  return (
    <main style={{
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      color: '#333333'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Mapsページ</h1>
      <label style={{
        display: 'block',
        marginBottom: '1rem',
        fontSize: '1rem',
        fontWeight: '500',
        color: '#495057'
      }}>
        スタイル選択：
        <select
          value={selectedStyleIndex}
          onChange={e => handleStyleChange(Number(e.target.value))}
          style={{
            marginLeft: '0.5rem',
            padding: '0.5rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            color: '#495057',
            fontSize: '0.9rem'
          }}
        >
          {styles.map((s, index) => (
            <option key={s.id} value={index}>{s.label}</option>
          ))}
        </select>
      </label>

      {/* 地図情報表示 */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '6px',
        padding: '0.75rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '2rem',
        fontSize: '0.9rem'
      }}>
        <div>
          <span style={{ fontWeight: '600', color: '#495057' }}>緯度: </span>
          <span style={{ color: '#2c3e50', fontFamily: 'monospace' }}>
            {mapInfo.center.lat.toFixed(6)}
          </span>
        </div>
        <div>
          <span style={{ fontWeight: '600', color: '#495057' }}>経度: </span>
          <span style={{ color: '#2c3e50', fontFamily: 'monospace' }}>
            {mapInfo.center.lng.toFixed(6)}
          </span>
        </div>
        <div>
          <span style={{ fontWeight: '600', color: '#495057' }}>ズーム: </span>
          <span style={{ color: '#2c3e50', fontFamily: 'monospace' }}>
            {mapInfo.zoom.toFixed(2)}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* レイヤーパネル */}
        <div style={{
          width: '300px',
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
              レイヤー一覧 ({layers.length})
            </h3>
            <button
              onClick={toggleAllExpansion}
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
                      onClick={() => toggleLayerExpansion(layer.id)}
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
                          toggleLayerVisibility(layer.id);
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

        {/* マップコンテナ */}
        <div
          ref={mapContainer}
          style={{
            flex: 1,
            height: 'calc(100vh - 200px)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #e9ecef'
          }}
        />

        {/* フィーチャー情報パネル（右側） */}
        {showFeaturePanel && (
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
                フィーチャー情報 ({clickedFeatures.length})
              </h3>
              <button
                onClick={() => {
                  console.log('フィーチャーパネルを閉じる');
                  setShowFeaturePanel(false);
                  if (clickMarkerRef.current) {
                    console.log('パネル閉じる時にマーカーを削除');
                    clickMarkerRef.current.remove();
                    clickMarkerRef.current = null;
                  }
                }}
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

            {clickedFeatures.length === 0 ? (
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
                {clickedFeatures.map((feature, index) => (
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
        )}
      </div>
    </main>
  );
}

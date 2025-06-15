"use client";

import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

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
  label: string;
  url?: string;
  style?: any;
};

const styles: StyleOption[] = [
  { label: 'MapLibre デモ', url: 'https://demotiles.maplibre.org/style.json' },
  { label: 'OpenStreetMap', url: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json' },
  { label: 'OSM ラスタタイル', style: createRasterStyle('https://tile.openstreetmap.jp/{z}/{x}/{y}.png', '© OpenStreetMap contributors') },
  { label: 'Positron (Light)', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
  { label: 'Dark Matter', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
];

type LayerInfo = {
  id: string;
  type: string;
  source?: string;
  visible: boolean;
};

export default function MapsPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);
  const [layers, setLayers] = useState<LayerInfo[]>([]);

  // レイヤー情報を更新する関数
  const updateLayers = (map: maplibregl.Map) => {
    try {
      const style = map.getStyle();
      if (style && style.layers) {
        const layerInfos: LayerInfo[] = style.layers.map(layer => ({
          id: layer.id,
          type: layer.type,
          source: (layer as any).source || undefined,
          visible: map.getLayoutProperty(layer.id, 'visibility') !== 'none'
        }));
        setLayers(layerInfos);
      }
    } catch (error) {
      console.error('レイヤー情報の取得エラー:', error);
    }
  };

  // レイヤーの表示/非表示を切り替える関数
  const toggleLayerVisibility = (layerId: string) => {
    if (!mapRef.current) return;

    const currentVisibility = mapRef.current.getLayoutProperty(layerId, 'visibility');
    const newVisibility = currentVisibility === 'none' ? 'visible' : 'none';

    mapRef.current.setLayoutProperty(layerId, 'visibility', newVisibility);
    updateLayers(mapRef.current);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const selectedStyle = styles[selectedStyleIndex];
    const styleToUse = selectedStyle.url || selectedStyle.style;

    // マップが既に存在する場合は削除して再作成
    if (mapRef.current) {
      console.log('既存のマップを削除してスタイルを切り替え:', selectedStyle.label);
      mapRef.current.remove();
      mapRef.current = null;
    }

    console.log('マップを初期化中:', selectedStyle.label);
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleToUse,
      center: [139.7671, 35.6812],
      zoom: 10,
    });

    map.on('load', () => {
      console.log('マップ読み込み完了:', selectedStyle.label);
      updateLayers(map);
    });

    map.on('style.load', () => {
      console.log('スタイル読み込み完了:', selectedStyle.label);
      updateLayers(map);
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
    <main style={{ padding: '2rem' }}>
      <h1>Mapsページ</h1>
      <label>
        スタイル選択：
        <select value={selectedStyleIndex} onChange={e => setSelectedStyleIndex(Number(e.target.value))}>
          {styles.map((s, index) => (
            <option key={index} value={index}>{s.label}</option>
          ))}
        </select>
      </label>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {/* レイヤーパネル */}
        <div style={{
          width: '300px',
          height: '500px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '1rem',
          overflow: 'auto'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
            レイヤー一覧 ({layers.length})
          </h3>

          {layers.length === 0 ? (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
              レイヤー情報を読み込み中...
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: layer.visible ? '#ffffff' : '#f1f3f4',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: layer.visible ? '#000' : '#6c757d' }}>
                        {layer.id}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                        {layer.type} {layer.source && `(${layer.source})`}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleLayerVisibility(layer.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.8rem',
                        backgroundColor: layer.visible ? '#28a745' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {layer.visible ? '表示' : '非表示'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* マップコンテナ */}
        <div
          ref={mapContainer}
          style={{
            flex: 1,
            height: '500px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px #0002'
          }}
        />
      </div>
    </main>
  );
}

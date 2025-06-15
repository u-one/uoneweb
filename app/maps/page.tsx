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
  { id: 'osm-bright-ja', label: 'OpenStreetMap', url: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json' },
  { id: 'osm-raster', label: 'OSM ラスタタイル', style: createRasterStyle('https://tile.openstreetmap.jp/{z}/{x}/{y}.png', '© OpenStreetMap contributors') },
  { id: 'positron', label: 'Positron (Light)', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
  { id: 'dark-matter', label: 'Dark Matter', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
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
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#2c3e50',
            borderBottom: '2px solid #e9ecef',
            paddingBottom: '0.5rem'
          }}>
            レイヤー一覧 ({layers.length})
          </h3>

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
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: layer.visible ? '#f8f9fa' : '#e9ecef',
                    border: `1px solid ${layer.visible ? '#dee2e6' : '#ced4da'}`,
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, marginRight: '0.5rem' }}>
                      <div style={{
                        fontWeight: '600',
                        color: layer.visible ? '#2c3e50' : '#6c757d',
                        marginBottom: '0.25rem'
                      }}>
                        {layer.id}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#6c757d',
                        backgroundColor: '#ffffff',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '3px',
                        border: '1px solid #e9ecef',
                        display: 'inline-block'
                      }}>
                        {layer.type} {layer.source && `(${layer.source})`}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleLayerVisibility(layer.id)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        backgroundColor: layer.visible ? '#28a745' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'background-color 0.2s ease',
                        minWidth: '60px'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = layer.visible ? '#218838' : '#c82333';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = layer.visible ? '#28a745' : '#dc3545';
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
            height: 'calc(100vh - 200px)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #e9ecef'
          }}
        />
      </div>
    </main>
  );
}

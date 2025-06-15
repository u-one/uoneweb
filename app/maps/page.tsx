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

export default function MapsPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);

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
    });

    map.on('style.load', () => {
      console.log('スタイル読み込み完了:', selectedStyle.label);
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
      <div ref={mapContainer} style={{ width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px #0002', marginTop: '1rem' }} />
    </main>
  );
}

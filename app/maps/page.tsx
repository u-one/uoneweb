"use client";

import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

const styles = [
  { label: 'MapLibre デモ', url: 'https://demotiles.maplibre.org/style.json' },
  { label: 'OpenStreetMap', url: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json' },
  { label: 'Positron (Light)', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
  { label: 'Dark Matter', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
];

export default function MapsPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [styleUrl, setStyleUrl] = useState(styles[0].url);

  useEffect(() => {
    if (!mapContainer.current) return;

    // マップが既に存在する場合は削除して再作成
    if (mapRef.current) {
      console.log('既存のマップを削除してスタイルを切り替え:', styleUrl);
      mapRef.current.remove();
      mapRef.current = null;
    }

    console.log('マップを初期化中:', styleUrl);
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [139.7671, 35.6812],
      zoom: 10,
    });

    map.on('load', () => {
      console.log('マップ読み込み完了:', styleUrl);
    });

    map.on('style.load', () => {
      console.log('スタイル読み込み完了:', styleUrl);
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
  }, [styleUrl]);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Mapsページ</h1>
      <label>
        スタイル選択：
        <select value={styleUrl} onChange={e => setStyleUrl(e.target.value)}>
          {styles.map(s => (
            <option key={s.url} value={s.url}>{s.label}</option>
          ))}
        </select>
      </label>
      <div ref={mapContainer} style={{ width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px #0002', marginTop: '1rem' }} />
    </main>
  );
}

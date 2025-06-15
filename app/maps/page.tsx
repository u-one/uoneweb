"use client";

import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

const styles = [
  { label: 'デフォルト', url: 'https://demotiles.maplibre.org/style.json' },
  { label: 'OSM Bright', url: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json' },
  { label: 'Stamen Toner', url: 'https://maps.tilehostiｋg.com/styles/toner/style.json?key=YOUR_API_KEY' },
  // 必要に応じて他のスタイルも追加可能
];

export default function MapsPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [styleUrl, setStyleUrl] = useState(styles[1].url);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) {
      mapRef.current.setStyle(styleUrl);
      return;
    }
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [139.7671, 35.6812],
      zoom: 10,
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;
    return () => map.remove();
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

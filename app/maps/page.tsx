"use client";

import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

export default function MapsPage() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [139.7671, 35.6812], // 東京駅
      zoom: 10,
    });
    return () => map.remove();
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Mapsページ</h1>
      <div ref={mapContainer} style={{ width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px #0002', marginTop: '1rem' }} />
    </main>
  );
}

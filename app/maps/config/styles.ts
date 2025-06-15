import { StyleOption } from '../hooks/useMapState';

// ラスタタイル用のスタイル定義
export const createRasterStyle = (tileUrl: string, attribution: string = '') => ({
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

export const styles: StyleOption[] = [
  { id: 'osm-bright-ja', label: 'osm-bright-ja', url: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json' },
  { id: 'osm-raster', label: 'OSM ラスタタイル', style: createRasterStyle('https://tile.openstreetmap.jp/{z}/{x}/{y}.png', '© OpenStreetMap contributors') },
  { id: 'maplibre-demo', label: 'MapLibre デモ', url: 'https://demotiles.maplibre.org/style.json' },
  { id: 'rekichizu', label: 'れきちず', url: 'https://mierune.github.io/rekichizu-style/styles/street/style.json' },
  { id: 'gsi-standard', label: '地理院:標準地図', url: './gsi_standard_style.json' },
  { id: 'gsi-light', label: '地理院:軽い標準地図', url: './gsi_light_style.json' },
  { id: 'gsi-kana', label: '地理院:ひらがな地図', url: './gsi_kana_style.json' }
];

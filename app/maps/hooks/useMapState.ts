import { useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import maplibregl from 'maplibre-gl';

export type LayerInfo = {
  id: string;
  type: string;
  source?: string;
  visible: boolean;
  title?: string;
};

export type StyleOption = {
  id: string;
  label: string;
  url?: string;
  style?: any;
};

export const useMapState = (styles: StyleOption[]) => {
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
  
  // State
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
  
  // Refs
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const clickMarkerRef = useRef<maplibregl.Marker | null>(null);
  
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
  
  // スタイル変更時にURLを更新
  const handleStyleChange = (newStyleIndex: number) => {
    setSelectedStyleIndex(newStyleIndex);
    updateURL(newStyleIndex, mapInfo.center, mapInfo.zoom);
  };
  
  return {
    // State
    selectedStyleIndex,
    layers,
    mapInfo,
    expandedLayers,
    allExpanded,
    clickedFeatures,
    showFeaturePanel,
    
    // Refs
    mapContainer,
    mapRef,
    clickMarkerRef,
    
    // Actions
    setLayers,
    setMapInfo,
    setExpandedLayers,
    setAllExpanded,
    setClickedFeatures,
    setShowFeaturePanel,
    handleStyleChange,
    updateURL
  };
};

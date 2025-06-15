import maplibregl from 'maplibre-gl';
import { LayerInfo } from './useMapState';

export const useMapOperations = (
  setLayers: (layers: LayerInfo[]) => void,
  setMapInfo: (info: { center: { lat: number; lng: number }; zoom: number }) => void,
  setClickedFeatures: (features: any[]) => void,
  setShowFeaturePanel: (show: boolean) => void,
  clickMarkerRef: React.MutableRefObject<maplibregl.Marker | null>,
  updateURL: (styleIndex: number, center: { lat: number; lng: number }, zoom: number) => void,
  selectedStyleIndex: number,
  setExpandedLayers: React.Dispatch<React.SetStateAction<Set<string>>>,
  setAllExpanded: (expanded: boolean) => void
) => {
  // レイヤー情報を更新する関数
  const updateLayers = (map: maplibregl.Map) => {
    try {
      const style = map.getStyle();
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
  const toggleLayerVisibility = (layerId: string, map: maplibregl.Map) => {
    if (!map) return;
    
    const currentVisibility = map.getLayoutProperty(layerId, 'visibility');
    const newVisibility = currentVisibility === 'none' ? 'visible' : 'none';
    
    map.setLayoutProperty(layerId, 'visibility', newVisibility);
    updateLayers(map);
  };

  // レイヤーの展開/折りたたみを切り替える関数
  const toggleLayerExpansion = (layerId: string, expandedLayers: Set<string>) => {
    setExpandedLayers((prev: Set<string>) => {
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
  const toggleAllExpansion = (allExpanded: boolean, layers: LayerInfo[]) => {
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

  return {
    updateLayers,
    updateMapInfo,
    toggleLayerVisibility,
    toggleLayerExpansion,
    toggleAllExpansion,
    handleMapClick
  };
};

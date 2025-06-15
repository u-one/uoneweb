"use client";

import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useState, Suspense } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapState } from './hooks/useMapState';
import { useMapOperations } from './hooks/useMapOperations';
import { useResponsive } from './hooks/useResponsive';
import { LayerPanel } from './components/LayerPanel';
import { FeaturePanel } from './components/FeaturePanel';
import { Modal } from './components/Modal';
import { FloatingButtons } from './components/FloatingButtons';
import { styles } from './config/styles';

function MapsContent() {
  const mapState = useMapState(styles);
  const { isMobile, isTablet } = useResponsive();
  const [showLayerModal, setShowLayerModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  const {
    selectedStyleIndex,
    layers,
    mapInfo,
    expandedLayers,
    allExpanded,
    clickedFeatures,
    showFeaturePanel,
    mapContainer,
    mapRef,
    clickMarkerRef,
    setLayers,
    setMapInfo,
    setExpandedLayers,
    setAllExpanded,
    setClickedFeatures,
    setShowFeaturePanel,
    handleStyleChange,
    updateURL
  } = mapState;

  const mapOperations = useMapOperations(
    setLayers,
    setMapInfo,
    setClickedFeatures,
    setShowFeaturePanel,
    clickMarkerRef,
    updateURL,
    selectedStyleIndex,
    setExpandedLayers,
    setAllExpanded
  );

  const {
    updateLayers,
    updateMapInfo,
    toggleLayerVisibility,
    toggleLayerExpansion,
    toggleAllExpansion,
    handleMapClick,
    getCurrentLocation
  } = mapOperations;

  useEffect(() => {
    if (!mapContainer.current) return;

    const selectedStyle = styles[selectedStyleIndex];
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

  const handleCloseFeaturePanel = () => {
    console.log('フィーチャーパネルを閉じる');
    setShowFeaturePanel(false);
    if (clickMarkerRef.current) {
      console.log('パネル閉じる時にマーカーを削除');
      clickMarkerRef.current.remove();
      clickMarkerRef.current = null;
    }
  };

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

      <div style={{
        display: 'flex',
        gap: isMobile ? '0' : '1rem',
        position: 'relative'
      }}>
        {/* デスクトップ用レイヤーパネル */}
        {!isMobile && !isTablet && (
          <LayerPanel
            layers={layers}
            expandedLayers={expandedLayers}
            allExpanded={allExpanded}
            onToggleLayerExpansion={(layerId) => toggleLayerExpansion(layerId, expandedLayers)}
            onToggleAllExpansion={() => toggleAllExpansion(allExpanded, layers)}
            onToggleLayerVisibility={(layerId) => toggleLayerVisibility(layerId, mapRef.current!)}
          />
        )}

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

        {/* デスクトップ用フィーチャー情報パネル（右側） */}
        {!isMobile && !isTablet && showFeaturePanel && (
          <FeaturePanel
            features={clickedFeatures}
            onClose={handleCloseFeaturePanel}
          />
        )}

        {/* モバイル・タブレット用フローティングボタン */}
        {(isMobile || isTablet) && (
          <FloatingButtons
            onLayersClick={() => setShowLayerModal(true)}
            onFeaturesClick={showFeaturePanel ? () => setShowFeatureModal(true) : undefined}
            onLocationClick={() => getCurrentLocation(mapRef.current!)}
            showFeaturesButton={showFeaturePanel}
            layersCount={layers.length}
            featuresCount={clickedFeatures.length}
          />
        )}

        {/* モバイル・タブレット用レイヤーモーダル */}
        {(isMobile || isTablet) && (
          <Modal
            isOpen={showLayerModal}
            onClose={() => setShowLayerModal(false)}
            title={`レイヤー一覧 (${layers.length})`}
            isMobile={isMobile}
          >
            <LayerPanel
              layers={layers}
              expandedLayers={expandedLayers}
              allExpanded={allExpanded}
              onToggleLayerExpansion={(layerId) => toggleLayerExpansion(layerId, expandedLayers)}
              onToggleAllExpansion={() => toggleAllExpansion(allExpanded, layers)}
              onToggleLayerVisibility={(layerId) => toggleLayerVisibility(layerId, mapRef.current!)}
              isModal={true}
            />
          </Modal>
        )}

        {/* モバイル・タブレット用フィーチャーモーダル */}
        {(isMobile || isTablet) && showFeaturePanel && (
          <Modal
            isOpen={showFeatureModal}
            onClose={() => setShowFeatureModal(false)}
            title={`フィーチャー情報 (${clickedFeatures.length})`}
            isMobile={isMobile}
          >
            <FeaturePanel
              features={clickedFeatures}
              onClose={() => setShowFeatureModal(false)}
              isModal={true}
            />
          </Modal>
        )}
      </div>
    </main>
  );
}

export default function MapsPage() {
  return (
    <Suspense fallback={
      <div style={{
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#6c757d'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            地図を読み込み中...
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    }>
      <MapsContent />
    </Suspense>
  );
}

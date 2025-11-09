/* global kakao */
import React, { useEffect, useRef } from 'react';

interface KakaoMapProps {
  lat: number;
  lng: number;
  merchantName: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ lat, lng, merchantName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps && mapContainer.current) {
      const { kakao } = window;
      const mapOption = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
      };

      const map = new kakao.maps.Map(mapContainer.current, mapOption);

      const markerPosition = new kakao.maps.LatLng(lat, lng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);

      const iwContent = `<div style="padding:5px; text-align:center;">${merchantName}</div>`;
      const infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        position: markerPosition,
      });
      
      infowindow.open(map, marker);

    }
  }, [lat, lng, merchantName]);

  return <div ref={mapContainer} style={{ width: '100%', height: '400px', borderRadius: '10px' }} />;
};

export default KakaoMap;

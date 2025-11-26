import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface InteractiveMapProps {
  latitude?: number;
  longitude?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  className?: string;
}

const InteractiveMap = ({ 
  latitude = 17.3619, 
  longitude = 120.7278,
  onLocationChange,
  className 
}: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Small delay to ensure container has dimensions
    const timer = setTimeout(() => {
      if (!mapContainer.current) return;

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors',
              maxzoom: 19
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm'
            }
          ]
        },
        center: [longitude, latitude],
        zoom: 15
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Create draggable marker
      marker.current = new maplibregl.Marker({ 
        draggable: true,
        color: '#10b981'
      })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

      // Handle marker drag
      marker.current.on('dragend', () => {
        const lngLat = marker.current?.getLngLat();
        if (lngLat && onLocationChange) {
          onLocationChange(lngLat.lat, lngLat.lng);
        }
      });

      // Handle map click
      map.current.on('click', (e) => {
        if (marker.current) {
          marker.current.setLngLat(e.lngLat);
          if (onLocationChange) {
            onLocationChange(e.lngLat.lat, e.lngLat.lng);
          }
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      map.current?.remove();
    };
  }, []);

  // Update marker position when props change
  useEffect(() => {
    if (marker.current && map.current) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.setCenter([longitude, latitude]);
    }
  }, [latitude, longitude]);

  return (
    <div ref={mapContainer} className={className} style={{ minHeight: '300px' }} />
  );
};

export default InteractiveMap;

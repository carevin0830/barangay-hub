import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface HouseholdsMapProps {
  className?: string;
}

const HouseholdsMap = ({ className }: HouseholdsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

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
        center: [120.9842, 14.5995], // Manila, Philippines coordinates - adjust as needed
        zoom: 13
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }, 100);

    return () => {
      clearTimeout(timer);
      map.current?.remove();
    };
  }, []);

  return (
    <div ref={mapContainer} className={className} style={{ minHeight: '400px' }} />
  );
};

export default HouseholdsMap;

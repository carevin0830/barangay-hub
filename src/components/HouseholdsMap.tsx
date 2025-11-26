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

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tiles.openfreemap.org/osm/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenFreeMap Contributors',
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

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div ref={mapContainer} className={className} />
  );
};

export default HouseholdsMap;

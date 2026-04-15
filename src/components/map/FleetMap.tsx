import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import type { Driver } from '../../data/types';

const DUBAI_CENTER = { lat: 25.1972, lng: 55.2744 };

const STATUS_COLORS: Record<string, string> = {
  on_trip:     'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  waiting:     'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  break:       'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  offline:     'http://maps.google.com/mapfiles/ms/icons/grey.png',
  maintenance: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
};

const STATUS_LABEL: Record<string, string> = {
  on_trip: 'On Trip', waiting: 'Waiting', break: 'Break', offline: 'Offline',
};

interface FleetMapProps {
  drivers: Driver[];
}

export default function FleetMap({ drivers }: FleetMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
  });

  const [selected, setSelected] = useState<Driver | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), []);
  const onUnmount = useCallback(() => setMap(null), []);
  void map;

  if (loadError) return (
    <div className="flex items-center justify-center h-full text-red-500 text-sm">
      Failed to load Google Maps
    </div>
  );

  if (!isLoaded) return (
    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
      Loading map…
    </div>
  );

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full rounded-b-2xl"
      center={DUBAI_CENTER}
      zoom={11}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        styles: [
          // Base — dark asphalt canvas
          { elementType: 'geometry',                                     stylers: [{ color: '#1a1a2e' }] },
          { elementType: 'labels.text.fill',                             stylers: [{ color: '#8b9bb4' }] },
          { elementType: 'labels.text.stroke',                           stylers: [{ color: '#1a1a2e' }] },
          // Water
          { featureType: 'water', elementType: 'geometry',               stylers: [{ color: '#0f1626' }] },
          { featureType: 'water', elementType: 'labels.text.fill',       stylers: [{ color: '#3d5a8a' }] },
          // Landscape
          { featureType: 'landscape',        elementType: 'geometry',    stylers: [{ color: '#1e2235' }] },
          { featureType: 'landscape.natural',elementType: 'geometry',    stylers: [{ color: '#1c2130' }] },
          // Roads — Uber uses bright white for major, muted for minor
          { featureType: 'road',             elementType: 'geometry',    stylers: [{ color: '#2d3348' }] },
          { featureType: 'road',             elementType: 'geometry.stroke', stylers: [{ color: '#1a1e2d' }] },
          { featureType: 'road.highway',     elementType: 'geometry',    stylers: [{ color: '#3a4260' }] },
          { featureType: 'road.highway',     elementType: 'geometry.stroke', stylers: [{ color: '#2a3050' }] },
          { featureType: 'road.highway',     elementType: 'labels.text.fill', stylers: [{ color: '#c0cde8' }] },
          { featureType: 'road.arterial',    elementType: 'labels.text.fill', stylers: [{ color: '#7a8ba8' }] },
          { featureType: 'road.local',       elementType: 'labels.text.fill', stylers: [{ color: '#4a5a70' }] },
          // POI — strip all noise
          { featureType: 'poi',              elementType: 'geometry',    stylers: [{ color: '#1e2438' }] },
          { featureType: 'poi',              elementType: 'labels',      stylers: [{ visibility: 'off' }] },
          { featureType: 'poi.park',         elementType: 'geometry',    stylers: [{ color: '#1a2830' }] },
          { featureType: 'poi.park',         elementType: 'labels.text.fill', stylers: [{ color: '#3a5a48' }] },
          // Transit
          { featureType: 'transit',          elementType: 'geometry',    stylers: [{ color: '#2a3050' }] },
          { featureType: 'transit.station',  elementType: 'labels.text.fill', stylers: [{ color: '#6a7a9a' }] },
          // Admin boundaries
          { featureType: 'administrative',   elementType: 'geometry',    stylers: [{ color: '#2a3050' }] },
          { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9faecb' }] },
          { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#c9d4e8' }] },
        ],
      }}
    >
      {drivers.map((driver) => (
        <Marker
          key={driver.id}
          position={driver.location}
          icon={STATUS_COLORS[driver.status]}
          title={driver.name}
          onClick={() => setSelected(driver)}
        />
      ))}

      {selected && (
        <InfoWindow
          position={selected.location}
          onCloseClick={() => setSelected(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -8) }}
        >
          <div style={{ background:'#1e2235', color:'#e2e8f0', borderRadius:'12px', padding:'12px 14px', minWidth:'200px', fontFamily:'Inter, sans-serif', border:'1px solid #2d3348' }}>
            <p style={{ fontWeight:700, fontSize:'14px', marginBottom:'2px', color:'#f1f5fb' }}>{selected.name}</p>
            <p style={{ fontSize:'11px', color:'#6a7a9a', marginBottom:'8px' }}>{selected.currentZone}</p>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'10px' }}>
              <span style={{
                width:'8px', height:'8px', borderRadius:'50%', flexShrink:0,
                background: selected.status==='on_trip'?'#3b82f6':selected.status==='waiting'?'#10b981':selected.status==='break'?'#f59e0b':'#6b7280'
              }}/>
              <span style={{ fontSize:'12px', fontWeight:600, color:'#c9d4e8', textTransform:'capitalize' }}>{STATUS_LABEL[selected.status]}</span>
            </div>
            <table style={{ width:'100%', borderTop:'1px solid #2d3348', paddingTop:'8px', borderCollapse:'collapse' }}>
              <tbody>
                {[
                  ['Platform', selected.platform],
                  ['Trips today', selected.tripsCompleted],
                  ['Revenue', `AED ${selected.revenueToday}`],
                  ['Rating', `${selected.customerRating} ⭐`],
                ].map(([label, val]) => (
                  <tr key={String(label)} style={{ lineHeight:'1.8' }}>
                    <td style={{ fontSize:'11px', color:'#6a7a9a', paddingRight:'10px' }}>{label}</td>
                    <td style={{ fontSize:'12px', fontWeight:600, color:'#c9d4e8', textTransform:'capitalize' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

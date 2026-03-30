import { useState, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { 
  Map as MapIcon, Layers, ShieldAlert, Navigation, 
  Filter, AlertTriangle, Clock, MapPin
} from 'lucide-react';

// Libraries array must be outside the component to prevent re-renders
const libraries = ['visualization'];

// Custom Dark Mode Map Style matching the SafeChain UI
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#475569" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f8fafc" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem',
};

// Default Center: VIT Vellore roughly
const center = { lat: 12.9692, lng: 79.1559 };

// Mock Data for Hackathon Demo
const MOCK_INCIDENTS = [
  { id: 1, lat: 12.9712, lng: 79.1589, type: 'Harassment', time: '10 mins ago', severity: 'high' },
  { id: 2, lat: 12.9652, lng: 79.1539, type: 'Suspicious Activity', time: '1 hour ago', severity: 'medium' },
  { id: 3, lat: 12.9682, lng: 79.1609, type: 'Theft / Robbery', time: '3 hours ago', severity: 'high' },
  { id: 4, lat: 12.9742, lng: 79.1519, type: 'Infrastructure Hazard', time: '5 hours ago', severity: 'low' },
  { id: 5, lat: 12.9622, lng: 79.1599, type: 'Harassment', time: 'Yesterday', severity: 'high' },
];

const SafetyMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    // Make sure to add this to your .env file: VITE_GOOGLE_MAPS_API_KEY=your_key_here
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
    libraries,
  });

  const [activeMarker, setActiveMarker] = useState(null);
  const [viewMode, setViewMode] = useState('markers'); // 'markers' or 'heatmap'
  const [filter, setFilter] = useState('All');

  const mapRef = useState(null);
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  // Filtered incidents based on sidebar selection
  const filteredIncidents = useMemo(() => {
    if (filter === 'All') return MOCK_INCIDENTS;
    return MOCK_INCIDENTS.filter(inc => inc.type === filter);
  }, [filter]);

  // Transform data for Google Maps HeatmapLayer
  const heatmapData = useMemo(() => {
    if (!isLoaded || !window.google) return [];
    return filteredIncidents.map(
      (inc) => new window.google.maps.LatLng(inc.lat, inc.lng)
    );
  }, [isLoaded, filteredIncidents]);

  if (loadError) return <div className="text-white text-center py-20">Error loading maps. Check your API Key.</div>;
  if (!isLoaded) return <div className="text-white text-center py-20 animate-pulse">Initializing SafeChain Maps...</div>;

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[600px] w-full flex flex-col lg:flex-row gap-6 pb-8">
      
      {/* Sidebar Controls */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-80 flex flex-col gap-6"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-purple-400" />
            Live Intel
          </h2>
          <p className="text-sm text-slate-400 mb-6">Real-time crowd-sourced safety data.</p>

          {/* View Toggle */}
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800 mb-6">
            <button
              onClick={() => setViewMode('markers')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'markers' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" /> Pins
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'heatmap' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> Heatmap
            </button>
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <Filter className="w-4 h-4" /> Filter Incidents
            </div>
            {['All', 'Harassment', 'Theft / Robbery', 'Suspicious Activity'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFilter(type);
                  setActiveMarker(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  filter === type 
                    ? 'bg-purple-500/10 border-purple-500/50 text-purple-300' 
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Alert Widget */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 shadow-xl mt-auto hidden lg:block">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-red-400 font-bold mb-1">High Risk Zone</h3>
              <p className="text-sm text-red-300/80 leading-relaxed">
                Multiple reports logged near Katpadi Road in the last 2 hours. Consider alternate routes.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-2 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-6 left-6 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl pointer-events-none">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">Live Network</span>
        </div>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={center}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
          }}
          onLoad={onLoad}
          onClick={() => setActiveMarker(null)} // Close info window when clicking map
        >
          {/* Heatmap Layer */}
          {viewMode === 'heatmap' && heatmapData.length > 0 && (
            <HeatmapLayer 
              data={heatmapData} 
              options={{
                radius: 40,
                opacity: 0.8,
                gradient: [
                  'rgba(0, 255, 255, 0)',
                  'rgba(0, 255, 255, 1)',
                  'rgba(89, 0, 255, 1)',
                  'rgba(255, 0, 255, 1)',
                  'rgba(255, 0, 0, 1)'
                ]
              }} 
            />
          )}

          {/* Marker Layer */}
          {viewMode === 'markers' && filteredIncidents.map((incident) => (
            <Marker
              key={incident.id}
              position={{ lat: incident.lat, lng: incident.lng }}
              onClick={() => setActiveMarker(incident)}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: incident.severity === 'high' ? '#ef4444' : incident.severity === 'medium' ? '#f59e0b' : '#3b82f6',
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: 8,
              }}
            />
          ))}

          {/* Info Window for Active Marker */}
          {activeMarker && viewMode === 'markers' && (
            <InfoWindow
              position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
              onCloseClick={() => setActiveMarker(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -10),
              }}
            >
              <div className="p-1 max-w-[200px]">
                {/* Inline styles here because Google Maps InfoWindow strips some Tailwind classes */}
                <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
                  {activeMarker.type}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  <Clock size={12} /> {activeMarker.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', fontWeight: '600', backgroundColor: '#ecfdf5', padding: '4px 8px', borderRadius: '4px' }}>
                  <ShieldAlert size={12} /> Blockchain Verified
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </motion.div>
    </div>
  );
};

export default SafetyMap;
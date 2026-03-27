import { useState, useEffect, useCallback, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Star, Crosshair } from 'lucide-react';
import QuickBeerLog from './QuickBeerLog';
import type { QuickBeerData } from './QuickBeerLog';
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useBeers } from '../../context/BeerContext';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface Bar {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  average_rating?: number;
  beer_count?: number;
}

export default function MapView() {
  const { addBeer } = useBeers();
  const { user, profile } = useAuth();
  const [bars, setBars] = useState<Bar[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewState, setViewState] = useState({
    longitude: -3.7038,
    latitude: 40.4168,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  });

  // User's live geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Quick beer log state
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [quickLogBar, setQuickLogBar] = useState<{ id?: string; name: string } | null>(null);
  const [quickLogCoords, setQuickLogCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [newPinCoords, setNewPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [quickLogLoading, setQuickLogLoading] = useState(false);

  // Double click detection
  const lastClickTime = useRef<number>(0);
  const lastClickCoords = useRef<{ x: number; y: number } | null>(null);

  // Track user location continuously
  useEffect(() => {
    if (navigator.geolocation) {
      // Get initial position and center map
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setViewState((prev) => ({
            ...prev,
            latitude: loc.lat,
            longitude: loc.lng,
          }));
        },
        () => {}, // silently fail
        { enableHighAccuracy: true }
      );

      // Watch position for live updates
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      );
    }

    // TODO: Fetch bars from Supabase
    const mockBars: Bar[] = [
      {
        id: '1',
        name: 'La Cervecería del Barrio',
        latitude: 40.42,
        longitude: -3.70,
        average_rating: 4.5,
        beer_count: 12,
      },
      {
        id: '2',
        name: 'El Sótano Cervecero',
        latitude: 40.41,
        longitude: -3.71,
        average_rating: 4.2,
        beer_count: 8,
      },
      {
        id: '3',
        name: 'Craft & Co.',
        latitude: 40.415,
        longitude: -3.695,
        average_rating: 4.8,
        beer_count: 23,
      },
    ];
    setBars(mockBars);
    setIsLoading(false);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open quick log for existing bar (from popup)
  const handleAddBeerToBar = useCallback((bar: Bar) => {
    setSelectedBar(null);
    setQuickLogBar({ id: bar.id, name: bar.name });
    setQuickLogCoords(null);
    setNewPinCoords(null);
    setQuickLogOpen(true);
  }, []);

  // Double click/tap on map to drop pin and open quick log
  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
    const now = Date.now();
    const timeDiff = now - lastClickTime.current;
    const prevCoords = lastClickCoords.current;

    lastClickTime.current = now;
    lastClickCoords.current = { x: e.point.x, y: e.point.y };

    // Check if it's a double click (within 400ms and close proximity)
    if (timeDiff < 400 && prevCoords) {
      const dx = e.point.x - prevCoords.x;
      const dy = e.point.y - prevCoords.y;
      if (Math.sqrt(dx * dx + dy * dy) < 30) {
        // It's a double tap — open quick log at this location
        const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        setNewPinCoords(coords);
        setQuickLogCoords(coords);
        setQuickLogBar({ name: '' });
        setQuickLogOpen(true);
        // Reset to prevent triple-tap
        lastClickTime.current = 0;
        lastClickCoords.current = null;
      }
    }
  }, []);

  // FAB: add beer at current location
  const handleAddBeerHere = useCallback(() => {
    if (userLocation) {
      setNewPinCoords(userLocation);
      setQuickLogCoords(userLocation);
      setQuickLogBar({ name: '' });
      setQuickLogOpen(true);
    } else {
      // Fallback: use map center
      const coords = { lat: viewState.latitude, lng: viewState.longitude };
      setNewPinCoords(coords);
      setQuickLogCoords(coords);
      setQuickLogBar({ name: '' });
      setQuickLogOpen(true);
    }
  }, [userLocation, viewState.latitude, viewState.longitude]);

  // Submit quick beer log
  const handleQuickLogSubmit = useCallback(async (data: QuickBeerData) => {
    setQuickLogLoading(true);
    try {
      // Determine bar info
      let barId = data.barId;
      const barCoords = data.newBarCoords;

      // If new bar was created, add it to the local bar list
      if (barCoords && data.barName) {
        barId = `bar-${Date.now()}`;
        const newBar: Bar = {
          id: barId,
          name: data.barName,
          latitude: barCoords.lat,
          longitude: barCoords.lng,
          average_rating: data.rating,
          beer_count: 1,
        };
        setBars((prev) => [...prev, newBar]);
      }

      // Save beer to shared context
      addBeer({
        userId: user?.id || 'current-user',
        userName: profile?.username || user?.email?.split('@')[0] || 'Tú',
        beerName: data.beerName,
        style: data.style,
        rating: data.rating,
        price: data.price,
        size: data.size,
        isDraft: data.isDraft,
        isPublic: data.isPublic,
        notes: data.notes,
        barId,
        barName: data.barName,
        barLat: barCoords?.lat,
        barLng: barCoords?.lng,
      });

      toast.success(
        data.isPublic
          ? `${data.beerName} registrada y publicada en La Taberna`
          : `${data.beerName} guardada en tu perfil`,
        { duration: 3000, icon: '🍺' }
      );

      setQuickLogOpen(false);
      setNewPinCoords(null);
      setQuickLogBar(null);
      setQuickLogCoords(null);
    } finally {
      setQuickLogLoading(false);
    }
  }, [addBeer, user, profile]);

  const handleCloseQuickLog = useCallback(() => {
    setQuickLogOpen(false);
    setNewPinCoords(null);
    setQuickLogBar(null);
    setQuickLogCoords(null);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        doubleClickZoom={false}
      >
        <NavigationControl position="bottom-right" showCompass={true} />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={true}
          showAccuracyCircle={true}
        />

        {/* User location pulse marker */}
        {userLocation && (
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
            anchor="center"
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10 relative" />
              <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-40" />
            </div>
          </Marker>
        )}

        {filteredBars.map((bar) => (
          <Marker
            key={bar.id}
            longitude={bar.longitude}
            latitude={bar.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedBar(bar);
            }}
          >
            <div className="cursor-pointer group">
              <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg border-3 border-white transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl">
                <span className="text-lg">🍺</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-orange-500 rotate-45 border-r-2 border-b-2 border-white"></div>
            </div>
          </Marker>
        ))}

        {/* Temporary pin for new bar location */}
        {newPinCoords && (
          <Marker
            longitude={newPinCoords.lng}
            latitude={newPinCoords.lat}
            anchor="bottom"
          >
            <div className="animate-bounce">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-xl border-3 border-white">
                <Plus size={24} className="text-white" />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-500 rotate-45 border-r-2 border-b-2 border-white"></div>
            </div>
          </Marker>
        )}

        {selectedBar && (
          <Popup
            longitude={selectedBar.longitude}
            latitude={selectedBar.latitude}
            anchor="bottom"
            offset={20}
            onClose={() => setSelectedBar(null)}
            closeButton={true}
            closeOnClick={false}
            className="cerves-popup"
          >
            <div className="p-4 min-w-[240px]">
              <h3 className="font-bold text-slate-800 text-lg mb-2">{selectedBar.name}</h3>
              {selectedBar.average_rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.round(selectedBar.average_rating!)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-amber-600 text-sm">{selectedBar.average_rating.toFixed(1)}</span>
                </div>
              )}
              <p className="text-sm text-slate-500 mb-4">
                <span className="font-semibold text-slate-700">{selectedBar.beer_count || 0}</span> cervezas registradas
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddBeerToBar(selectedBar)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  <Plus size={16} />
                  Cerveza
                </button>
                <Link
                  to={`/bar/${selectedBar.id}`}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                >
                  <MapPin size={14} />
                  Ver
                </Link>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 max-w-sm z-10">
        <div className="relative group">
          <Search
            size={20}
            className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-amber-500 transition-colors"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar bares..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-lg font-medium text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Hint toast - shows briefly */}
      <MapHint />

      {/* Add Beer Here FAB - uses current geolocation */}
      <button
        onClick={handleAddBeerHere}
        className="absolute bottom-24 md:bottom-8 right-4 z-10 bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl px-5 py-4 shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-bold"
      >
        <Crosshair size={22} />
        <span className="text-sm">Cerveza aquí</span>
      </button>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg">
              <span className="text-3xl animate-bounce">🍺</span>
            </div>
            <p className="text-slate-600 font-semibold">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Quick Beer Log Bottom Sheet */}
      <QuickBeerLog
        isOpen={quickLogOpen}
        onClose={handleCloseQuickLog}
        onSubmit={handleQuickLogSubmit}
        barName={quickLogBar?.name || ''}
        barId={quickLogBar?.id}
        mapCoords={quickLogCoords || undefined}
        isLoading={quickLogLoading}
      />
    </div>
  );
}

/** Small hint that appears once to teach users */
function MapHint() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('cerves-map-hint');
    if (shown) {
      setDismissed(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 2000);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setDismissed(true);
      sessionStorage.setItem('cerves-map-hint', '1');
    }, 6000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`absolute top-20 left-1/2 -translate-x-1/2 z-10 bg-slate-800/90 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium backdrop-blur-sm transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      Doble toque en el mapa o pulsa "Cerveza aquí"
    </div>
  );
}

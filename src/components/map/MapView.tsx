import { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Star } from 'lucide-react';

interface Bar {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  average_rating?: number;
  beer_count?: number;
}

interface MapViewProps {
  onAddBar?: () => void;
}

export default function MapView({ onAddBar }: MapViewProps) {
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewState((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      });
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
  }, []);

  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" showCompass={true} />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={true}
        />

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
              <Link
                to={`/bar/${selectedBar.id}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <MapPin size={14} />
                Ver bar
              </Link>
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

      {/* Add Bar FAB */}
      <button
        onClick={onAddBar}
        className="absolute bottom-24 md:bottom-8 right-4 z-10 bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full p-4 shadow-xl transition-all duration-200 transform hover:scale-110"
      >
        <Plus size={28} />
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
    </div>
  );
}

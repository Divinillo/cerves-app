import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

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

const createCustomIcon = () => new DivIcon({
  html: `
    <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full text-white text-lg shadow-2xl border-2 border-white transition-transform hover:scale-110" style="transform: translateY(0);">
      🍺
    </div>
    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-orange-500"></div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function MapView({ onAddBar }: MapViewProps) {
  const [bars, setBars] = useState<Bar[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [center, setCenter] = useState<[number, number]>([40.4168, -3.7038]); // Madrid
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
      });
    }

    // TODO: Fetch bars from API
    // For now, use mock data
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
    ];
    setBars(mockBars);
    setIsLoading(false);
  }, []);

  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      {/* Map */}
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {filteredBars.map((bar) => (
          <Marker
            key={bar.id}
            position={[bar.latitude, bar.longitude]}
            icon={createCustomIcon()}
          >
            <Popup>
              <div className="w-72 p-4">
                <h3 className="font-bold text-slate-800 text-lg mb-3">{bar.name}</h3>
                {bar.average_rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.round(bar.average_rating!)
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-amber-600">{bar.average_rating.toFixed(1)}</span>
                  </div>
                )}
                <p className="text-sm text-slate-600 mb-4">
                  <strong>{bar.beer_count || 0}</strong> cervezas registradas
                </p>
                <Link
                  to={`/bar/${bar.id}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <MapPin size={16} />
                  Ver bar
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Search Bar */}
      <div className="absolute top-6 left-6 right-6 max-w-sm z-40">
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
            className="w-full pl-12 pr-4 py-3 bg-white/95 backdrop-blur border border-white/20 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-lg font-medium text-slate-800"
          />
        </div>
      </div>

      {/* Add Bar FAB */}
      <button
        onClick={onAddBar}
        className="absolute bottom-8 right-8 z-40 bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full p-4 shadow-2xl transition-all duration-200 transform hover:scale-110 hover:shadow-3xl"
      >
        <Plus size={32} />
      </button>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mb-4 shadow-lg">
              <span className="text-3xl animate-bounce">🍺</span>
            </div>
            <p className="text-slate-800 font-semibold">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}

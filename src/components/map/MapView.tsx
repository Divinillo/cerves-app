import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
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

const customIcon = new DivIcon({
  html: `
    <div class="flex items-center justify-center w-8 h-8 bg-amber-500 rounded-full text-white text-lg shadow-lg border-2 border-amber-600">
      🍺
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
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
    <div className="relative h-screen w-full">
      {/* Map */}
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredBars.map((bar) => (
          <Marker
            key={bar.id}
            position={[bar.latitude, bar.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2 text-sm">
                <h3 className="font-bold text-slate-800">{bar.name}</h3>
                {bar.average_rating && (
                  <p className="text-amber-600">
                    ⭐ {bar.average_rating.toFixed(1)} ({bar.beer_count || 0} cervezas)
                  </p>
                )}
                <Link
                  to={`/bar/${bar.id}`}
                  className="block mt-2 text-amber-600 hover:text-amber-700 font-semibold text-xs"
                >
                  Ver bar →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 max-w-md z-40">
        <div className="relative bg-white rounded-lg shadow-lg">
          <Search
            size={20}
            className="absolute left-3 top-3 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar bares..."
            className="w-full pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Add Bar FAB */}
      <button
        onClick={onAddBar}
        className="absolute bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 shadow-lg transition transform hover:scale-110"
      >
        <Plus size={28} />
      </button>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-30">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <p className="text-slate-600">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}

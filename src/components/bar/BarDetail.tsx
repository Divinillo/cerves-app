import { useParams } from 'react-router-dom';
import { MapPin, Plus } from 'lucide-react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import BeerLogCard from '../beer-log/BeerLogCard';

interface BarDetailProps {
  data?: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    photoUrl: string;
    averageRating: number;
    totalBeers: number;
    mostPopularStyle: string;
    beers: any[];
  };
}

export default function BarDetail({ data }: BarDetailProps) {
  const { barId } = useParams();

  const bar = data || {
    id: barId || '1',
    name: 'La Cervecería del Barrio',
    address: 'Calle Principal 123, Madrid',
    latitude: 40.42,
    longitude: -3.70,
    photoUrl: '',
    averageRating: 4.5,
    totalBeers: 24,
    mostPopularStyle: 'IPA',
    beers: [
      { id: '1', beerName: 'Doble Lúpulo IPA', style: 'IPA', rating: 4.5, price: 5.5, size: 'caña', isDraft: true },
      { id: '2', beerName: 'Porter Negra', style: 'Porter', rating: 4.2, price: 6.0, size: 'caña', isDraft: true },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-amber-400 to-orange-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🍻</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{bar.name}</h1>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={18} />
              <p className="text-sm">{bar.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Puntuación</p>
              <div className="flex items-center justify-center gap-1">
                <span className="font-bold text-lg text-amber-600">{bar.averageRating.toFixed(1)}</span>
                <span className="text-amber-400">⭐</span>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Cervezas</p>
              <span className="font-bold text-lg text-slate-800">{bar.totalBeers}</span>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Top estilo</p>
              <span className="font-bold text-sm text-slate-800">{bar.mostPopularStyle}</span>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md">
            <Plus size={20} />
            Añadir cerveza
          </button>
        </div>
      </div>

      {/* Mini Map */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-48">
        <Map
          initialViewState={{
            longitude: bar.longitude,
            latitude: bar.latitude,
            zoom: 15,
          }}
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
          interactive={false}
          attributionControl={false}
        >
          <Marker longitude={bar.longitude} latitude={bar.latitude} anchor="bottom">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg border-2 border-white">
              <span className="text-lg">🍺</span>
            </div>
          </Marker>
        </Map>
      </div>

      {/* Beers Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Cervezas registradas ({bar.totalBeers})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bar.beers.map((beer) => (
            <BeerLogCard
              key={beer.id}
              id={beer.id}
              beerName={beer.beerName}
              style={beer.style}
              barName={bar.name}
              rating={beer.rating}
              price={beer.price}
              size={beer.size}
              isDraft={beer.isDraft}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

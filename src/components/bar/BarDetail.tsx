import { useParams } from 'react-router-dom';
import { MapPin, Plus, Beer } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import BeerLogCard from '../beer-log/BeerLogCard';
import Rating from '../shared/Rating';
import 'leaflet/dist/leaflet.css';

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

export default function BarDetail({ data }: BarDetailProps) {
  const { barId } = useParams();

  // Mock data if not provided
  const bar = data || {
    id: barId || '1',
    name: 'La Cervecería del Barrio',
    address: 'Calle Principal 123, Madrid',
    latitude: 40.42,
    longitude: -3.70,
    photoUrl: 'https://via.placeholder.com/600x400',
    averageRating: 4.5,
    totalBeers: 24,
    mostPopularStyle: 'IPA',
    beers: [
      {
        id: '1',
        beerName: 'Doble Lúpulo IPA',
        style: 'IPA',
        rating: 4.5,
        price: 5.5,
        size: 'caña',
        isDraft: true,
      },
      {
        id: '2',
        beerName: 'Porter Negra',
        style: 'Porter',
        rating: 4.2,
        price: 6.0,
        size: 'caña',
        isDraft: true,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Photo */}
        <div className="relative aspect-video">
          <img
            src={bar.photoUrl}
            alt={bar.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bar Info */}
        <div className="p-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{bar.name}</h1>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={20} />
              <p>{bar.address}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Puntuación</p>
              <div className="flex items-center gap-2 mt-1">
                <Rating value={Math.round(bar.averageRating)} readonly size="sm" />
                <span className="font-bold text-amber-600">
                  {bar.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Cervezas</p>
              <div className="flex items-center gap-2 mt-1">
                <Beer size={20} className="text-amber-500" />
                <span className="font-bold text-slate-800">{bar.totalBeers}</span>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Más popular</p>
              <p className="font-bold text-slate-800 mt-1">{bar.mostPopularStyle}</p>
            </div>
          </div>

          {/* Add Beer Button */}
          <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
            <Plus size={20} />
            Añadir cerveza
          </button>
        </div>
      </div>

      {/* Mini Map */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-64">
        <MapContainer
          center={[bar.latitude, bar.longitude]}
          zoom={15}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[bar.latitude, bar.longitude]} icon={customIcon} />
        </MapContainer>
      </div>

      {/* Beers Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
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

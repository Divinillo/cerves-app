import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { Link } from 'react-router-dom';

interface BarMarkerProps {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  averageRating?: number;
  beerCount?: number;
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

export default function BarMarker({
  id,
  name,
  latitude,
  longitude,
  averageRating,
  beerCount,
}: BarMarkerProps) {
  return (
    <Marker position={[latitude, longitude]} icon={customIcon}>
      <Popup>
        <div className="p-2 text-sm">
          <h3 className="font-bold text-slate-800">{name}</h3>
          {averageRating && (
            <p className="text-amber-600">
              ⭐ {averageRating.toFixed(1)} ({beerCount || 0} cervezas)
            </p>
          )}
          <Link
            to={`/bar/${id}`}
            className="block mt-2 text-amber-600 hover:text-amber-700 font-semibold text-xs"
          >
            Ver bar →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

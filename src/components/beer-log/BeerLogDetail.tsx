import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MapPin, Share2, Plus } from 'lucide-react';
import Rating from '../shared/Rating';
import TagBadge from '../shared/TagBadge';

interface BeerLogDetailProps {
  data?: {
    id: string;
    beerName: string;
    style: string;
    barName: string;
    barId: string;
    location: string;
    rating: number;
    price: number;
    size: string;
    isDraft: boolean;
    photoUrl: string;
    review: string;
    tags: string[];
    userName: string;
    userAvatar: string;
    userId: string;
  };
}

export default function BeerLogDetail({ data }: BeerLogDetailProps) {
  const { beerLogId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data if not provided
  const beerLog = data || {
    id: beerLogId || '1',
    beerName: 'Doble Lúpulo IPA',
    style: 'IPA',
    barName: 'La Cervecería del Barrio',
    barId: '1',
    location: 'Calle Principal 123, Madrid',
    rating: 4.5,
    price: 5.5,
    size: 'caña',
    isDraft: true,
    photoUrl: 'https://via.placeholder.com/400x300',
    review: 'Excelente cerveza con un aroma floral y amargo bien equilibrado. El cuerpo es medio-oscuro con un final seco muy agradable.',
    tags: ['hoppy', 'crafted', 'spanish'],
    userName: 'Juan López',
    userAvatar: 'https://via.placeholder.com/40x40',
    userId: 'user1',
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Photo */}
        <div className="relative aspect-video">
          <img
            src={beerLog.photoUrl}
            alt={beerLog.beerName}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-3 transition"
          >
            <Heart
              size={24}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}
            />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              {beerLog.beerName}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
                {beerLog.style}
              </span>
              <span className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                {beerLog.isDraft ? '🍻 Grifo' : '🍾 Botella'}
              </span>
              <span className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                {beerLog.size}
              </span>
            </div>
          </div>

          {/* Rating and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">Puntuación</p>
              <div className="flex items-center gap-2">
                <Rating value={beerLog.rating} readonly size="lg" />
                <span className="text-2xl font-bold text-amber-600">
                  {beerLog.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">Precio</p>
              <p className="text-3xl font-bold text-amber-600">
                {beerLog.price.toFixed(2)}€
              </p>
            </div>
          </div>

          {/* Bar Info */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="font-bold text-slate-800 mb-2">Bar</h2>
            <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
              <MapPin size={20} className="text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-800">{beerLog.barName}</h3>
                <p className="text-sm text-slate-600">{beerLog.location}</p>
              </div>
            </div>
          </div>

          {/* Review */}
          <div className="border-t border-slate-200 pt-4">
            <h2 className="font-bold text-slate-800 mb-2">Comentario</h2>
            <p className="text-slate-700 leading-relaxed">{beerLog.review}</p>
          </div>

          {/* Tags */}
          {beerLog.tags.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <h2 className="font-bold text-slate-800 mb-2">Etiquetas</h2>
              <div className="flex flex-wrap gap-2">
                {beerLog.tags.map((tag) => (
                  <TagBadge key={tag} label={tag} variant="secondary" />
                ))}
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="border-t border-slate-200 pt-4 flex items-center gap-4">
            <img
              src={beerLog.userAvatar}
              alt={beerLog.userName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{beerLog.userName}</p>
              <p className="text-sm text-slate-600">@{beerLog.userId}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-6">
            <button className="flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg font-semibold transition">
              <Plus size={20} />
              Añadir a lista
            </button>
            <button className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-semibold transition">
              <Share2 size={20} />
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MapPin, Plus, Share2 } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Photo Hero */}
        <div className="relative aspect-video group overflow-hidden">
          <img
            src={beerLog.photoUrl}
            alt={beerLog.beerName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-full p-3 transition-all shadow-lg transform hover:scale-110"
          >
            <Heart
              size={24}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}
            />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              {beerLog.beerName}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold">
                {beerLog.style}
              </span>
              <span className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-semibold">
                {beerLog.isDraft ? '🍻 Grifo' : '🍾 Botella'}
              </span>
              <span className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-semibold">
                {beerLog.size}
              </span>
            </div>
          </div>

          {/* Rating and Price Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <p className="text-sm text-slate-600 mb-3 font-bold uppercase tracking-wide">Puntuación</p>
              <div className="flex items-center gap-3">
                <Rating value={Math.round(beerLog.rating)} readonly size="lg" />
                <span className="text-4xl font-bold text-amber-600">
                  {beerLog.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <p className="text-sm text-slate-600 mb-3 font-bold uppercase tracking-wide">Precio</p>
              <p className="text-4xl font-bold text-amber-600">
                {beerLog.price.toFixed(2)}€
              </p>
            </div>
          </div>

          {/* Bar Info */}
          <div className="border-t-2 border-slate-200 pt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">📍 Dónde lo probé</h2>
            <div className="flex items-start gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <MapPin size={24} className="text-amber-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{beerLog.barName}</h3>
                <p className="text-slate-600 mt-1">{beerLog.location}</p>
              </div>
            </div>
          </div>

          {/* Review */}
          {beerLog.review && (
            <div className="border-t-2 border-slate-200 pt-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">💬 Mi comentario</h2>
              <blockquote className="border-l-4 border-amber-500 pl-6 py-3 bg-slate-50 rounded-r-lg text-slate-700 italic leading-relaxed">
                {beerLog.review}
              </blockquote>
            </div>
          )}

          {/* Tags */}
          {beerLog.tags.length > 0 && (
            <div className="border-t-2 border-slate-200 pt-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">🏷️ Etiquetas</h2>
              <div className="flex flex-wrap gap-2">
                {beerLog.tags.map((tag) => (
                  <TagBadge key={tag} label={tag} variant="secondary" />
                ))}
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="border-t-2 border-slate-200 pt-8 flex items-center gap-4 bg-amber-50 rounded-2xl p-6">
            {beerLog.userAvatar ? (
              <img
                src={beerLog.userAvatar}
                alt={beerLog.userName}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xl">
                {beerLog.userName[0]}
              </div>
            )}
            <div>
              <p className="font-bold text-slate-800 text-lg">{beerLog.userName}</p>
              <p className="text-sm text-slate-600">@{beerLog.userId}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-4 border-t-2 border-slate-200 pt-8">
            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-800 px-6 py-3 rounded-xl font-bold transition-all">
              <Plus size={20} />
              Añadir a lista
            </button>
            <button className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-bold transition-all">
              <Share2 size={20} />
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

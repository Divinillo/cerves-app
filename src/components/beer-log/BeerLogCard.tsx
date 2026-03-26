import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock } from 'lucide-react';
import Rating from '../shared/Rating';
import TagBadge from '../shared/TagBadge';

interface BeerLogCardProps {
  id: string;
  beerName: string;
  style: string;
  barName: string;
  location?: string;
  rating: number;
  price: number;
  size: string;
  isDraft: boolean;
  photoUrl?: string;
  tags?: string[];
  userName?: string;
  userAvatar?: string;
  timeAgo?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

export default function BeerLogCard({
  id,
  beerName,
  style,
  barName,
  location,
  rating,
  price,
  size,
  isDraft,
  photoUrl,
  tags = [],
  userName,
  userAvatar,
  timeAgo = 'Hace 2 horas',
  isFavorite = false,
  onFavoriteToggle,
}: BeerLogCardProps) {
  const [isLiked, setIsLiked] = useState(isFavorite);

  const handleFavorite = () => {
    setIsLiked(!isLiked);
    onFavoriteToggle?.(!isLiked);
  };

  return (
    <Link
      to={`/cerveza/${id}`}
      className="block bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
    >
      <div className="relative aspect-video bg-slate-200 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={beerName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-5xl group-hover:scale-110 transition-transform duration-300">
            🍺
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleFavorite();
          }}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 transition-all shadow-lg transform hover:scale-110"
        >
          <Heart
            size={20}
            className={isLiked ? 'fill-red-500 text-red-500' : 'text-slate-600'}
          />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* User Info */}
        {userName && (
          <div className="flex items-center gap-2 text-xs">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-7 h-7 rounded-full object-cover border-2 border-amber-500"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                {userName[0]}
              </div>
            )}
            <span className="text-slate-700 font-semibold">{userName}</span>
            {timeAgo && (
              <span className="text-slate-500 flex items-center gap-1 ml-auto">
                <Clock size={12} />
                {timeAgo}
              </span>
            )}
          </div>
        )}

        {/* Beer Info */}
        <div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">{beerName}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
              {style}
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
              {isDraft ? '🍻 Grifo' : '🍾 Botella'} • {size}
            </span>
          </div>
        </div>

        {/* Bar Info */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-slate-800">{barName}</p>
            {location && <p className="text-xs text-slate-500">{location}</p>}
          </div>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Rating value={Math.round(rating)} readonly size="sm" />
            <span className="text-sm font-bold text-amber-600">{rating.toFixed(1)}</span>
          </div>
          <span className="text-lg font-bold text-amber-600">{price.toFixed(2)}€</span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} label={tag} variant="secondary" />
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-slate-500 ml-1">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

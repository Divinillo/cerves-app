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
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
    >
      <div className="aspect-video bg-slate-200 overflow-hidden relative">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={beerName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 text-4xl">
            🍺
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleFavorite();
          }}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 transition"
        >
          <Heart
            size={20}
            className={isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'}
          />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* User Info */}
        {userName && (
          <div className="flex items-center gap-2">
            {userAvatar && (
              <img
                src={userAvatar}
                alt={userName}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="text-sm text-slate-600 font-medium">{userName}</span>
            {timeAgo && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} />
                {timeAgo}
              </span>
            )}
          </div>
        )}

        {/* Beer Info */}
        <div>
          <h3 className="font-bold text-slate-800">{beerName}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              {style}
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
              {isDraft ? '🍻 Grifo' : '🍾 Botella'} • {size}
            </span>
          </div>
        </div>

        {/* Bar Info */}
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-slate-800">{barName}</p>
            {location && <p className="text-xs text-slate-500">{location}</p>}
          </div>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rating value={rating} readonly size="sm" />
            <span className="text-sm font-semibold text-slate-700">{rating}.0</span>
          </div>
          <span className="text-lg font-bold text-amber-600">{price.toFixed(2)}€</span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} label={tag} variant="secondary" />
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-slate-500">+{tags.length - 3} más</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

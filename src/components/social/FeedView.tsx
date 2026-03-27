import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Star, MapPin, Heart, MessageSquare, Navigation } from 'lucide-react';
import { useBeers } from '../../context/BeerContext';
import { useAuth } from '../../hooks/useAuth';
import type { SavedBeer } from '../../context/BeerContext';

const ITEMS_PER_PAGE = 6;

const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'ahora';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return date.toLocaleDateString('es-ES');
};

export default function FeedView() {
  const { getPublicBeers, toggleFavorite, isFavorite } = useBeers();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const publicBeers = getPublicBeers();
  const displayPosts = publicBeers.slice(0, visibleCount);
  const hasMore = visibleCount < publicBeers.length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setVisibleCount(ITEMS_PER_PAGE);
    setIsRefreshing(false);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, publicBeers.length));
  };

  const handleToggleFav = (beerId: string) => {
    if (user?.id) {
      toggleFavorite(user.id, beerId);
    }
  };

  const handleGoToMap = (post: SavedBeer) => {
    if (post.barLat && post.barLng) {
      navigate(`/mapa?lat=${post.barLat}&lng=${post.barLng}&beer=${post.id}`);
    } else {
      navigate('/mapa');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      {/* Viking Hall Header */}
      <div className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 rounded-2xl shadow-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0L40 20L20 40L0 20z\' fill=\'%23fff\' fill-opacity=\'.05\'/%3E%3C/svg%3E")'}}></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🍻</span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">La Taberna</h1>
              <p className="text-amber-200/80 text-sm font-medium">El salón donde todos brindan</p>
            </div>
          </div>
          <p className="text-amber-100/60 text-xs mt-2">
            {publicBeers.length} cerveza{publicBeers.length !== 1 ? 's' : ''} compartida{publicBeers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Refresh bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">
          Cervezas públicas de la comunidad
        </p>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition disabled:opacity-50"
        >
          <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Posts */}
      {displayPosts.length > 0 ? (
        <div className="space-y-5">
          {displayPosts.map((post) => (
            <TavernaPost
              key={post.id}
              post={post}
              isLiked={user?.id ? isFavorite(user.id, post.id) : false}
              onLike={() => handleToggleFav(post.id)}
              onGoToMap={() => handleGoToMap(post)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-5xl mb-4">🍺</p>
          <p className="text-slate-700 text-xl font-semibold">La Taberna está vacía</p>
          <p className="text-slate-500 text-sm mt-3">
            Registra una cerveza en el mapa y márcala como pública
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="w-full bg-white border-2 border-amber-400 hover:bg-amber-50 text-amber-600 py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-sm"
        >
          Cargar más ({publicBeers.length - visibleCount} restantes)
        </button>
      )}
    </div>
  );
}

/** Full beer post card for La Taberna */
function TavernaPost({
  post,
  isLiked,
  onLike,
  onGoToMap,
}: {
  post: SavedBeer;
  isLiked: boolean;
  onLike: () => void;
  onGoToMap: () => void;
}) {
  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* User header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {post.userName[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 truncate">{post.userName}</p>
          <p className="text-xs text-slate-400">{timeAgo}</p>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
          Público
        </span>
      </div>

      {/* Beer name + style hero */}
      <div className="px-5 pb-3">
        <h3 className="text-xl font-extrabold text-slate-800 mb-1.5">{post.beerName}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
            {post.style}
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
            {post.isDraft ? '🍻 Grifo' : '🍾 Botella'} · {post.size}
          </span>
        </div>
      </div>

      {/* Rating + Price row */}
      <div className="flex items-center justify-between px-5 pb-3">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={22}
              className={s <= post.rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-200'
              }
            />
          ))}
          <span className="ml-1 font-bold text-amber-600">{post.rating.toFixed(1)}</span>
        </div>
        <span className="text-xl font-extrabold text-amber-600">{post.price.toFixed(2)}€</span>
      </div>

      {/* Bar info */}
      <div className="flex items-start gap-2 px-5 pb-3">
        <MapPin size={16} className="mt-0.5 flex-shrink-0 text-amber-500" />
        <div>
          <p className="font-semibold text-slate-800 text-sm">{post.barName}</p>
          {post.barAddress && <p className="text-xs text-slate-400">{post.barAddress}</p>}
        </div>
      </div>

      {/* Notes */}
      {post.notes && (
        <div className="px-5 pb-3">
          <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-100">
            <div className="flex items-start gap-2">
              <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-amber-400" />
              <p className="text-sm text-slate-700 leading-relaxed">{post.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions bar */}
      <div className="flex items-center border-t border-slate-100 px-5 py-3 gap-6">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${
            isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
          }`}
        >
          <Heart size={20} className={isLiked ? 'fill-red-500' : ''} />
          {isLiked ? 'Te gusta' : 'Me gusta'}
        </button>
        {post.barLat && post.barLng && (
          <button
            onClick={onGoToMap}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-amber-600 transition-all"
          >
            <Navigation size={18} />
            Ver en mapa
          </button>
        )}
      </div>
    </div>
  );
}

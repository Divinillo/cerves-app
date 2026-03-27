import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import ActivityCard from './ActivityCard';

const allMockActivities = [
  {
    id: '1',
    type: 'beer_logged' as const,
    userId: 'user1',
    userName: 'Juan López',
    userAvatar: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    beerLog: {
      id: 'beer1',
      beerName: 'Doble Lúpulo IPA',
      style: 'IPA',
      barName: 'La Cervecería del Barrio',
      rating: 4.5,
      price: 5.5,
    },
  },
  {
    id: '2',
    type: 'badge_earned' as const,
    userId: 'user2',
    userName: 'María García',
    userAvatar: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
    badge: {
      id: 'badge1',
      name: 'Cervecero',
      icon: '🍺',
    },
  },
  {
    id: '3',
    type: 'beer_logged' as const,
    userId: 'user3',
    userName: 'Carlos Ruiz',
    userAvatar: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    beerLog: {
      id: 'beer2',
      beerName: 'Porter Negra',
      style: 'Porter',
      barName: 'El Sótano Cervecero',
      rating: 4.7,
      price: 6.0,
    },
  },
  {
    id: '4',
    type: 'beer_logged' as const,
    userId: 'user4',
    userName: 'Ana Martínez',
    userAvatar: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    beerLog: {
      id: 'beer3',
      beerName: 'Alhambra Reserva',
      style: 'Lager',
      barName: 'La Tape',
      rating: 4.3,
      price: 3.5,
    },
  },
  {
    id: '5',
    type: 'badge_earned' as const,
    userId: 'user1',
    userName: 'Juan López',
    userAvatar: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    badge: {
      id: 'badge2',
      name: 'Explorador',
      icon: '🗺️',
    },
  },
  {
    id: '6',
    type: 'beer_logged' as const,
    userId: 'user5',
    userName: 'Pedro Sánchez',
    userAvatar: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    beerLog: {
      id: 'beer4',
      beerName: 'West Coast IPA',
      style: 'IPA',
      barName: 'Craft & Co.',
      rating: 4.9,
      price: 7.0,
    },
  },
  {
    id: '7',
    type: 'beer_logged' as const,
    userId: 'user2',
    userName: 'María García',
    userAvatar: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    beerLog: {
      id: 'beer5',
      beerName: 'Blue Moon',
      style: 'Wheat',
      barName: 'The Irish Rover',
      rating: 4.1,
      price: 5.0,
    },
  },
  {
    id: '8',
    type: 'beer_logged' as const,
    userId: 'user6',
    userName: 'Laura Fernández',
    userAvatar: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    beerLog: {
      id: 'beer6',
      beerName: 'Guinness Draught',
      style: 'Stout',
      barName: 'The Irish Rover',
      rating: 4.4,
      price: 5.5,
    },
  },
];

const ITEMS_PER_PAGE = 4;

export default function FeedView() {
  const [tab, setTab] = useState<'following' | 'public'>('following');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const displayActivities = allMockActivities.slice(0, visibleCount);
  const hasMore = visibleCount < allMockActivities.length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setVisibleCount(ITEMS_PER_PAGE);
    setIsRefreshing(false);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, allMockActivities.length));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'}}></div>
        <div className="relative">
          <h1 className="text-3xl font-bold">Bibliocerve</h1>
          <p className="text-white/80 mt-1">Descubre lo que bebe la comunidad</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20 z-40 backdrop-blur-xl bg-white/95">
        <div className="flex items-center gap-6 border-b-2 border-slate-200 pb-4">
          <button
            onClick={() => { setTab('following'); setVisibleCount(ITEMS_PER_PAGE); }}
            className={`px-4 py-2 font-bold text-lg transition-all -mb-4 border-b-4 ${
              tab === 'following'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Siguiendo
          </button>
          <button
            onClick={() => { setTab('public'); setVisibleCount(ITEMS_PER_PAGE); }}
            className={`px-4 py-2 font-bold text-lg transition-all -mb-4 border-b-4 ${
              tab === 'public'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Público
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ml-auto text-slate-600 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw
              size={24}
              className={isRefreshing ? 'animate-spin' : ''}
            />
          </button>
        </div>
      </div>

      {/* Activities */}
      {displayActivities.length > 0 ? (
        <div className="space-y-5">
          {displayActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-5xl mb-4">🍺</p>
          <p className="text-slate-700 text-xl font-semibold">
            No hay actividad en tu feed aún
          </p>
          <p className="text-slate-500 text-sm mt-3">
            Sigue usuarios para ver sus actividades
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="w-full border-2 border-amber-500 hover:bg-amber-50 text-amber-600 py-3 rounded-xl font-bold transition-all active:scale-[0.98]"
        >
          Cargar más ({allMockActivities.length - visibleCount} restantes)
        </button>
      )}
    </div>
  );
}

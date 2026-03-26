import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import ActivityCard from './ActivityCard';

interface FeedViewProps {
  activities?: any[];
}

export default function FeedView({ activities }: FeedViewProps) {
  const [tab, setTab] = useState<'following' | 'public'>('following');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockActivities = [
    {
      id: '1',
      type: 'beer_logged',
      userId: 'user1',
      userName: 'Juan López',
      userAvatar: 'https://via.placeholder.com/40x40',
      timestamp: '2024-03-26T14:30:00Z',
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
      type: 'badge_earned',
      userId: 'user2',
      userName: 'María García',
      userAvatar: 'https://via.placeholder.com/40x40',
      timestamp: '2024-03-26T12:00:00Z',
      badge: {
        id: 'badge1',
        name: 'Cervecero',
        icon: '🍺',
      },
    },
  ];

  const displayActivities = activities || mockActivities;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20 z-40 backdrop-blur-xl bg-white/95">
        <div className="flex items-center gap-6 border-b-2 border-slate-200 pb-4">
          <button
            onClick={() => setTab('following')}
            className={`px-4 py-2 font-bold text-lg transition-all -mb-4 border-b-4 ${
              tab === 'following'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Siguiendo
          </button>
          <button
            onClick={() => setTab('public')}
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
      {displayActivities.length > 0 && (
        <button className="w-full border-2 border-amber-500 hover:bg-amber-50 text-amber-600 py-3 rounded-xl font-bold transition-all">
          Cargar más
        </button>
      )}
    </div>
  );
}

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
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-20 z-40">
        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setTab('following')}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
              tab === 'following'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Siguiendo
          </button>
          <button
            onClick={() => setTab('public')}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
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
            className="ml-auto text-slate-600 hover:text-amber-600 transition disabled:opacity-50"
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? 'animate-spin' : ''}
            />
          </button>
        </div>
      </div>

      {/* Activities */}
      {displayActivities.length > 0 ? (
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-slate-500 text-lg">
            No hay actividad en tu feed aún
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Sigue usuarios para ver sus actividades
          </p>
        </div>
      )}

      {/* Load More */}
      {displayActivities.length > 0 && (
        <button className="w-full border border-amber-500 hover:bg-amber-50 text-amber-600 py-2 rounded-lg font-semibold transition">
          Cargar más
        </button>
      )}
    </div>
  );
}

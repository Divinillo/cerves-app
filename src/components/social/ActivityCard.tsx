import { Link } from 'react-router-dom';

interface ActivityCardProps {
  activity: {
    id: string;
    type: 'beer_logged' | 'badge_earned' | 'bar_created';
    userId: string;
    userName: string;
    userAvatar: string;
    timestamp: string;
    beerLog?: {
      id: string;
      beerName: string;
      style: string;
      barName: string;
      rating: number;
      price: number;
    };
    badge?: {
      id: string;
      name: string;
      icon: string;
    };
  };
}

const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Hace unos segundos';
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
  if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;
  return date.toLocaleDateString('es-ES');
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const timeAgo = getTimeAgo(activity.timestamp);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <Link to={`/perfil/${activity.userId}`} className="flex items-center gap-3 hover:opacity-80 transition">
          <img
            src={activity.userAvatar}
            alt={activity.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-slate-800">{activity.userName}</p>
            <p className="text-xs text-slate-500">{timeAgo}</p>
          </div>
        </Link>
      </div>

      {/* Activity Content */}
      <div className="p-4">
        {activity.type === 'beer_logged' && activity.beerLog && (
          <>
            <p className="text-slate-700 mb-4">
              Probó{' '}
              <span className="font-bold text-slate-800">
                {activity.beerLog.beerName}
              </span>
              {' '}en{' '}
              <span className="font-bold text-slate-800">
                {activity.beerLog.barName}
              </span>
            </p>

            <div className="bg-amber-50 rounded-lg p-4 mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-700">
                  <span className="font-semibold">{activity.beerLog.style}</span>
                  {' | '}
                  <span className="text-amber-600 font-bold">
                    {activity.beerLog.rating.toFixed(1)}⭐
                  </span>
                </p>
                <p className="text-lg font-bold text-amber-600">
                  {activity.beerLog.price.toFixed(2)}€
                </p>
              </div>
            </div>
          </>
        )}

        {activity.type === 'badge_earned' && activity.badge && (
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-5xl mb-2">{activity.badge.icon}</div>
            <p className="font-bold text-slate-800">
              ¡Consiguió el logro "{activity.badge.name}"!
            </p>
          </div>
        )}

        {activity.type === 'bar_created' && (
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-slate-700">
              Añadió un nuevo bar a la comunidad
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

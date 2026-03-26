import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCheck, UserPlus, Edit } from 'lucide-react';
import BeerLogCard from '../beer-log/BeerLogCard';
import BadgeCard from '../badges/BadgeCard';

interface ProfileViewProps {
  data?: {
    userId: string;
    username: string;
    bio: string;
    avatarUrl: string;
    beerCount: number;
    barCount: number;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
    isOwnProfile: boolean;
    badges: any[];
    beers: any[];
    favorites: any[];
  };
}

export default function ProfileView({ data }: ProfileViewProps) {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<'beers' | 'favorites' | 'lists'>('beers');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data
  const profile = data || {
    userId: userId || 'user1',
    username: 'Juan López',
    bio: 'Cervecero aficionado desde hace 5 años. IPA lover 🍺',
    avatarUrl: 'https://via.placeholder.com/120x120',
    beerCount: 127,
    barCount: 34,
    followersCount: 523,
    followingCount: 187,
    isFollowing: false,
    isOwnProfile: true,
    badges: [
      { id: '1', name: 'Principiante', icon: '🌱', earned: true },
      { id: '2', name: 'Cervecero', icon: '🍺', earned: true },
      { id: '3', name: 'Explorador', icon: '🗺️', earned: false },
    ],
    beers: [
      {
        id: '1',
        beerName: 'Doble Lúpulo IPA',
        style: 'IPA',
        barName: 'La Cervecería del Barrio',
        rating: 4.5,
        price: 5.5,
        size: 'caña',
        isDraft: true,
      },
    ],
    favorites: [],
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.username}
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-500"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800">{profile.username}</h1>
            <p className="text-slate-600 mt-1">{profile.bio}</p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {profile.beerCount}
                </p>
                <p className="text-sm text-slate-600">Cervezas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {profile.barCount}
                </p>
                <p className="text-sm text-slate-600">Bares</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {profile.followersCount}
                </p>
                <p className="text-sm text-slate-600">Seguidores</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {profile.followingCount}
                </p>
                <p className="text-sm text-slate-600">Siguiendo</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6">
              {profile.isOwnProfile ? (
                <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition">
                  <Edit size={20} />
                  Editar perfil
                </button>
              ) : (
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                    isFollowing
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={20} />
                      Siguiendo
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Seguir
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Logros</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {profile.badges.map((badge) => (
            <div key={badge.id} className="flex-shrink-0">
              <BadgeCard badge={badge} />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('beers')}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
              activeTab === 'beers'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Mis Cervezas ({profile.beerCount})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
              activeTab === 'favorites'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Favoritos ({profile.favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
              activeTab === 'lists'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Listas
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'beers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.beers.map((beer) => (
              <BeerLogCard
                key={beer.id}
                id={beer.id}
                beerName={beer.beerName}
                style={beer.style}
                barName={beer.barName}
                rating={beer.rating}
                price={beer.price}
                size={beer.size}
                isDraft={beer.isDraft}
              />
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="text-center py-8">
            <p className="text-slate-500">No hay favoritos aún</p>
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="text-center py-8">
            <p className="text-slate-500">No hay listas creadas</p>
          </div>
        )}
      </div>
    </div>
  );
}

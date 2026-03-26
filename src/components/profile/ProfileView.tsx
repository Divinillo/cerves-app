import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCheck, UserPlus, Edit, Trophy } from 'lucide-react';
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
    <div className="w-full space-y-8">
      {/* Profile Header with Banner */}
      <div className="relative">
        {/* Banner */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-xl overflow-hidden">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'}}></div>
        </div>

        {/* Profile Card Overlapping Banner */}
        <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={profile.avatarUrl}
                  alt={profile.username}
                  className="w-40 h-40 rounded-2xl object-cover border-4 border-amber-500 shadow-xl"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">{profile.username}</h1>
                <p className="text-lg text-slate-600 mb-6">{profile.bio}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{profile.beerCount}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">CERVEZAS</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{profile.barCount}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">BARES</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{profile.followersCount}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">SEGUIDORES</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{profile.followingCount}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">SIGUIENDO</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {profile.isOwnProfile ? (
                    <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
                      <Edit size={20} />
                      Editar perfil
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        isFollowing
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg'
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
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">

        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy size={28} className="text-amber-600" />
            <h2 className="text-2xl font-bold text-slate-800">Logros</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4">
            {profile.badges.map((badge) => (
              <div key={badge.id} className="flex-shrink-0">
                <BadgeCard badge={badge} />
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="border-b-2 border-slate-200 mb-8 flex gap-8">
            <button
              onClick={() => setActiveTab('beers')}
              className={`px-4 py-3 font-bold text-lg transition-all border-b-4 -mb-2 ${
                activeTab === 'beers'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Mis Cervezas
              <span className="ml-2 text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                {profile.beerCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-3 font-bold text-lg transition-all border-b-4 -mb-2 ${
                activeTab === 'favorites'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Favoritos
              <span className="ml-2 text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                {profile.favorites.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('lists')}
              className={`px-4 py-3 font-bold text-lg transition-all border-b-4 -mb-2 ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">No hay favoritos aún</p>
            </div>
          )}

          {activeTab === 'lists' && (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">No hay listas creadas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

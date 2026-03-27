import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCheck, UserPlus, Edit, Trophy } from 'lucide-react';
import BeerLogCard from '../beer-log/BeerLogCard';
import BadgeCard from '../badges/BadgeCard';
import EditProfileModal from './EditProfileModal';
import EditBeerModal from '../beer-log/EditBeerModal';
import { useAuth } from '../../hooks/useAuth';
import { useBeers } from '../../context/BeerContext';
import { storageService } from '../../services/storage.service';
import type { SavedBeer } from '../../context/BeerContext';
import toast from 'react-hot-toast';

export default function ProfileView() {
  const { userId } = useParams();
  const { user, profile: authProfile } = useAuth();
  const { getUserBeers, getFavorites, toggleFavorite, isFavorite, updateBeer } = useBeers();
  const [activeTab, setActiveTab] = useState<'beers' | 'favorites' | 'lists'>('beers');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBeer, setEditingBeer] = useState<SavedBeer | null>(null);

  const isOwnProfile = !userId || userId === user?.id;
  const currentUserId = userId || user?.id || '';

  // Get beers from shared context
  const userBeers = getUserBeers(currentUserId);
  const favoriteBeers = getFavorites(currentUserId);

  // Unique bars from user's beers
  const uniqueBars = new Set(userBeers.map((b) => b.barName)).size;

  // Use real profile data when available
  const profileData = {
    userId: currentUserId,
    username: authProfile?.username || 'Juan López',
    bio: authProfile?.bio || 'Cervecero aficionado desde hace 5 años. IPA lover',
    avatarUrl: authProfile?.avatar_url || '',
    isPublic: authProfile?.is_public ?? true,
    beerCount: userBeers.length,
    barCount: uniqueBars,
    followersCount: 523,
    followingCount: 187,
  };

  const badges = [
    { id: '1', name: 'Principiante', icon: '🌱', earned: true },
    { id: '2', name: 'Cervecero', icon: '🍺', earned: true },
    { id: '3', name: 'Explorador', icon: '🗺️', earned: true },
    { id: '4', name: 'IPA Lover', icon: '🏆', earned: false },
    { id: '5', name: 'Fotógrafo', icon: '📸', earned: false },
  ];

  const handleFavoriteToggle = (beerId: string, _isFav: boolean) => {
    if (currentUserId) {
      toggleFavorite(currentUserId, beerId);
    }
  };

  const handleSaveBeer = (beerId: string, updates: Partial<SavedBeer>, newPhoto?: File) => {
    updateBeer(beerId, updates);
    // Upload new photo in background
    if (newPhoto && user?.id) {
      storageService.uploadBeerPhoto(newPhoto, user.id, beerId).then((result) => {
        if (result.data) {
          updateBeer(beerId, { photoUrl: result.data });
        } else if (result.moderation) {
          toast.error(result.error?.message || 'Foto rechazada: contenido inapropiado', {
            duration: 5000,
            icon: '🚫',
          });
        }
      });
    }
  };

  const handleSaveProfile = async (data: { username: string; bio: string; isPublic: boolean; avatar?: File }) => {
    // TODO: save to Supabase
    console.log('Saving profile:', data);
  };

  return (
    <div className="w-full space-y-8">
      {/* Profile Header with Banner */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-xl overflow-hidden">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'}}></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profileData.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt={profileData.username}
                    className="w-40 h-40 rounded-2xl object-cover border-4 border-amber-500 shadow-xl"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-4 border-amber-500 shadow-xl">
                    <span className="text-6xl text-white">{profileData.username[0]?.toUpperCase()}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">{profileData.username}</h1>
                <p className="text-lg text-slate-600 mb-6">{profileData.bio}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{profileData.beerCount}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">CERVEZAS</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{profileData.barCount}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">BARES</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{profileData.followersCount}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">SEGUIDORES</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{profileData.followingCount}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium">SIGUIENDO</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {isOwnProfile ? (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                    >
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

      <div className="max-w-4xl mx-auto px-6 space-y-8">

        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy size={28} className="text-amber-600" />
            <h2 className="text-2xl font-bold text-slate-800">Logros</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex-shrink-0">
                <BadgeCard badge={badge} />
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="border-b-2 border-slate-200 mb-8 flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('beers')}
              className={`px-4 py-3 font-bold text-lg transition-all border-b-4 -mb-2 whitespace-nowrap ${
                activeTab === 'beers'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Mis Cervezas
              <span className="ml-2 text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                {userBeers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-3 font-bold text-lg transition-all border-b-4 -mb-2 whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Favoritos
              <span className="ml-2 text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                {favoriteBeers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('lists')}
              className={`px-4 py-3 font-bold text-lg transition-all border-b-4 -mb-2 whitespace-nowrap ${
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
            userBeers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userBeers.map((beer) => (
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
                    photoUrl={beer.photoUrl}
                    tags={beer.tags}
                    isFavorite={isFavorite(currentUserId, beer.id)}
                    onFavoriteToggle={(isFav) => handleFavoriteToggle(beer.id, isFav)}
                    onEdit={isOwnProfile ? () => setEditingBeer(beer) : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🍺</p>
                <p className="text-slate-500 text-lg">Aún no has registrado cervezas</p>
                <p className="text-slate-400 text-sm mt-2">Ve al mapa y añade tu primera cerveza</p>
              </div>
            )
          )}

          {activeTab === 'favorites' && (
            favoriteBeers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoriteBeers.map((beer) => (
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
                    photoUrl={beer.photoUrl}
                    tags={beer.tags}
                    isFavorite={true}
                    onFavoriteToggle={(isFav) => handleFavoriteToggle(beer.id, isFav)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">❤️</p>
                <p className="text-slate-500 text-lg">No hay favoritos aún</p>
                <p className="text-slate-400 text-sm mt-2">Pulsa el corazón en una cerveza para guardarla</p>
              </div>
            )
          )}

          {activeTab === 'lists' && (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-slate-500 text-lg">No hay listas creadas</p>
              <p className="text-slate-400 text-sm mt-2">Próximamente podrás crear listas temáticas</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Beer Modal */}
      {editingBeer && (
        <EditBeerModal
          beer={editingBeer}
          isOpen={!!editingBeer}
          onClose={() => setEditingBeer(null)}
          onSave={handleSaveBeer}
        />
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
        currentData={{
          username: profileData.username,
          bio: profileData.bio,
          isPublic: profileData.isPublic,
          avatarUrl: profileData.avatarUrl,
        }}
      />
    </div>
  );
}

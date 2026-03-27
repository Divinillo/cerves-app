import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Beer, Map, BookOpen, Trophy } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, profile, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Top Bar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/40 border-b border-white/10 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-bold text-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
              <Beer size={24} className="text-white" />
            </div>
            <span className="text-white">Cerves</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="flex items-center gap-8">
            {isAuthenticated && (
              <>
                <Link to="/mapa" className="text-slate-300 hover:text-amber-400 font-medium transition-colors duration-200">
                  Mapa
                </Link>
                <Link to="/feed" className="text-slate-300 hover:text-amber-400 font-medium transition-colors duration-200">
                  Bibliocerve
                </Link>
                <Link to="/rankings" className="text-slate-300 hover:text-amber-400 font-medium transition-colors duration-200">
                  Rankings
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-full transition-colors duration-200"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile?.avatar_url}
                      alt={profile?.username || user?.email}
                      className="w-8 h-8 rounded-full object-cover border-2 border-amber-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <span className="text-sm text-slate-300">{profile?.username || user?.email?.split('@')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl py-2 border border-slate-700 backdrop-blur">
                    <Link
                      to="/perfil"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 transition-colors flex items-center gap-2"
                    >
                      <User size={18} />
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-t border-white/10">
        <div className="flex items-center justify-around h-20">
          {isAuthenticated ? (
            <>
              <NavIconButton icon={Map} label="Mapa" to="/mapa" />
              <NavIconButton icon={BookOpen} label="Biblio" to="/feed" />
              <NavIconButton icon={Trophy} label="Rankings" to="/rankings" />
              <NavIconButton icon={User} label="Perfil" to="/perfil" />
              <button
                onClick={handleLogout}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-slate-400 hover:text-red-400 transition-colors duration-200"
              >
                <LogOut size={24} />
                <span className="text-xs font-medium">Salir</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-slate-300 hover:text-amber-400 transition-colors w-full h-full flex items-center justify-center"
            >
              <User size={24} />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 bottom-20 z-40 bg-slate-900/95 backdrop-blur">
          <div className="p-6 space-y-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/mapa"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-slate-300 hover:text-amber-400 transition-colors font-medium"
                >
                  Mapa
                </Link>
                <Link
                  to="/feed"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-slate-300 hover:text-amber-400 transition-colors font-medium"
                >
                  Bibliocerve
                </Link>
                <Link
                  to="/rankings"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-slate-300 hover:text-amber-400 transition-colors font-medium"
                >
                  Rankings
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function NavIconButton({ icon: Icon, label, to }: { icon: any; label: string; to: string; onClick?: () => void }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-slate-400 hover:text-amber-400 transition-colors duration-200"
    >
      <Icon size={24} />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}

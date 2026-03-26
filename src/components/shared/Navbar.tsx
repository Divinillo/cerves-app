import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Beer } from 'lucide-react';
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
    <nav className="bg-amber-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-slate-50">
            <Beer size={28} className="text-amber-100" />
            <span>Cerves</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <Link to="/mapa" className="text-slate-50 hover:text-slate-100 font-medium transition">
                  Mapa
                </Link>
                <Link to="/feed" className="text-slate-50 hover:text-slate-100 font-medium transition">
                  Feed
                </Link>
                <Link to="/rankings" className="text-slate-50 hover:text-slate-100 font-medium transition">
                  Rankings
                </Link>
                <Link to="/perfil" className="text-slate-50 hover:text-slate-100 font-medium transition">
                  Mi Perfil
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-full text-slate-50 transition"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile?.avatar_url}
                      alt={profile?.username || user?.email}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="text-sm">{profile?.username || user?.email}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-50 rounded-lg shadow-xl py-2">
                    <Link
                      to="/perfil"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-slate-800 hover:bg-amber-50 transition flex items-center gap-2"
                    >
                      <User size={18} />
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-slate-800 hover:bg-amber-50 transition flex items-center gap-2"
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
                className="bg-amber-600 hover:bg-amber-700 text-slate-50 px-6 py-2 rounded-full font-medium transition"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-50"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-amber-600">
            {isAuthenticated && (
              <>
                <Link
                  to="/mapa"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-slate-50 hover:text-slate-100 transition"
                >
                  Mapa
                </Link>
                <Link
                  to="/feed"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-slate-50 hover:text-slate-100 transition"
                >
                  Feed
                </Link>
                <Link
                  to="/rankings"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-slate-50 hover:text-slate-100 transition"
                >
                  Rankings
                </Link>
                <Link
                  to="/perfil"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-slate-50 hover:text-slate-100 transition"
                >
                  Mi Perfil
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-slate-50 hover:text-slate-100 transition"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

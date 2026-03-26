import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Trophy, Zap, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/mapa');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 py-32 text-center space-y-12">
          {/* Logo and Title */}
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-2xl">
              <span className="text-5xl">🍺</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Cerves
            </h1>
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Descubre, puntúa y comparte
              <br />
              <span className="text-amber-400">las mejores cervezas</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Sigue tu viaje cervecero, descubre nuevos sabores y conecta con una comunidad apasionada por la buena cerveza.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              to="/login"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="bg-white/10 hover:bg-white/20 border-2 border-white text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 text-lg backdrop-blur"
            >
              Registrarse
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-6 py-20 space-y-16">
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-amber-500/50 transition-all group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 group-hover:from-amber-500/40 group-hover:to-orange-500/40 transition-all mb-5">
                <MapPin size={28} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mapa de Bares</h3>
              <p className="text-slate-400">
                Descubre bares cerveceros cerca de ti, explora nuevas ubicaciones y consulta las mejores opciones de tu zona.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-amber-500/50 transition-all group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 group-hover:from-amber-500/40 group-hover:to-orange-500/40 transition-all mb-5">
                <Users size={28} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Comunidad</h3>
              <p className="text-slate-400">
                Conecta con otros cerveceros apasionados, comparte tus descubrimientos y sigue a usuarios que te interesan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-amber-500/50 transition-all group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 group-hover:from-amber-500/40 group-hover:to-orange-500/40 transition-all mb-5">
                <Trophy size={28} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rankings</h3>
              <p className="text-slate-400">
                Consulta las cervezas y bares mejor valorados de la comunidad y descubre las nuevas tendencias cerveceras.
              </p>
            </div>
          </div>

          {/* Secondary Features */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Logging */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/20 mb-5">
                <Zap size={28} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Registra cervezas</h3>
              <p className="text-slate-300">
                Puntúa, comenta y comparte cada cerveza que pruebes con fotos, notas y etiquetas personalizadas.
              </p>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/20 mb-5">
                <Shield size={28} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Logros y Badges</h3>
              <p className="text-slate-300">
                Desbloquea logros mientras exploras, pruebas estilos y contribuyes a la comunidad cervecera.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Una comunidad en crecimiento</h2>
            <p className="text-slate-400">Únete a miles de cerveceros apasionados</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-amber-400">1.2K+</p>
              <p className="text-slate-400 mt-2">Cervezas registradas</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-amber-400">850+</p>
              <p className="text-slate-400 mt-2">Usuarios activos</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-amber-400">450+</p>
              <p className="text-slate-400 mt-2">Bares listados</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur rounded-2xl p-12">
            <h2 className="text-2xl font-bold mb-4">¿Listo para comenzar tu viaje cervecero?</h2>
            <p className="text-slate-400 mb-6">Únete a la comunidad hoy y descubre cervezas increíbles</p>
            <Link
              to="/registro"
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-400 mb-2">
            Cerves - La plataforma definitiva para cerveceros apasionados
          </p>
          <p className="text-slate-500 text-sm">
            © 2024 Cerves. Todos los derechos reservados. Hecho con ❤️ para los amantes de la buena cerveza.
          </p>
        </div>
      </div>
    </div>
  );
}

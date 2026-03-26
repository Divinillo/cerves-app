import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Beer, MapPin, Users, Trophy } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Beer size={48} className="text-amber-600" />
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800">
            Cerves
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Descubre las mejores cervezas
        </h2>

        <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
          Sigue tu viaje cervecero, comparte tus descubrimientos y conecta con otros amantes de la buena cerveza.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/login"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            className="bg-white hover:bg-amber-50 text-amber-600 border-2 border-amber-600 px-8 py-3 rounded-lg font-semibold transition text-lg"
          >
            Registrarse
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <MapPin size={40} className="text-amber-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Mapa de bares</h3>
            <p className="text-slate-600">
              Descubre bares cerveceros cerca de ti y explora nuevas ubicaciones
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <Users size={40} className="text-amber-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Comunidad</h3>
            <p className="text-slate-600">
              Conecta con otros cerveceros y comparte tus descubrimientos favoritos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <Trophy size={40} className="text-amber-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Rankings</h3>
            <p className="text-slate-600">
              Consulta las cervezas y bares mejor valorados de la comunidad
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-800 text-white py-8 mt-20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-slate-400">
            Cerves es la plataforma para cerveceros apasionados
          </p>
          <p className="text-slate-500 text-sm mt-2">
            © 2024 Cerves. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

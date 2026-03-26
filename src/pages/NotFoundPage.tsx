import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative text-center max-w-md">
        {/* Large 404 */}
        <div className="text-9xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          404
        </div>

        {/* Beer Emoji */}
        <div className="text-7xl mb-8 animate-bounce">
          🍺
        </div>

        {/* Messages */}
        <h1 className="text-4xl font-bold text-white mb-3">
          Página no encontrada
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          Parece que esta cerveza se ha evaporado... o la página simplemente no existe.
        </p>

        {/* CTA */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          <Home size={24} />
          Volver a inicio
        </Link>

        {/* Fun message */}
        <p className="text-slate-500 text-sm mt-8">
          Si crees que esto es un error, contacta con nuestro equipo
        </p>
      </div>
    </div>
  );
}

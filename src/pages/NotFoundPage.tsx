import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="text-center">
        <AlertCircle size={64} className="text-amber-600 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-slate-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Página no encontrada
        </h2>
        <p className="text-slate-600 mb-8 max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          <Home size={20} />
          Volver a inicio
        </Link>
      </div>
    </div>
  );
}

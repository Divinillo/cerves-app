import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Supabase handles the token from the URL hash automatically
    // via onAuthStateChange in AuthContext.
    // Once user is detected, redirect to map.
    if (user) {
      navigate('/mapa', { replace: true });
    }
  }, [user, navigate]);

  // Show a loading state while Supabase processes the token
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Iniciando sesión...</p>
      </div>
    </div>
  );
}

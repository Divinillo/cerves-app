import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/shared/Layout';
import AuthGuard from './components/auth/AuthGuard';
import { AuthProvider } from './context/AuthContext';
import { BeerProvider } from './context/BeerContext';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import { useAuth } from './hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MapPage from './pages/MapPage';
import FeedPage from './pages/FeedPage';
import RankingsPage from './pages/RankingsPage';
import ProfilePage from './pages/ProfilePage';
import BarPage from './pages/BarPage';
import BeerLogPage from './pages/BeerLogPage';
import ListsPage from './pages/ListsPage';
import ListDetailPage from './pages/ListDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function AppContent() {
  const { user, profile, onboardingDone, completeOnboarding } = useAuth();

  // Show wizard for logged-in users who haven't completed onboarding
  const showWizard = !!user && !onboardingDone;

  return (
    <>
      {showWizard && (
        <OnboardingWizard
          onComplete={completeOnboarding}
          defaultNickname={profile?.username || user?.email?.split('@')[0] || ''}
        />
      )}
      <BeerProvider>
      <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<SignUpPage />} />

            {/* Protected Routes */}
            <Route
              path="/mapa"
              element={
                <AuthGuard>
                  <MapPage />
                </AuthGuard>
              }
            />
            <Route
              path="/feed"
              element={
                <AuthGuard>
                  <FeedPage />
                </AuthGuard>
              }
            />
            <Route
              path="/rankings"
              element={
                <AuthGuard>
                  <RankingsPage />
                </AuthGuard>
              }
            />
            <Route
              path="/perfil"
              element={
                <AuthGuard>
                  <ProfilePage />
                </AuthGuard>
              }
            />
            <Route
              path="/perfil/:userId"
              element={
                <AuthGuard>
                  <ProfilePage />
                </AuthGuard>
              }
            />
            <Route
              path="/bar/:barId"
              element={
                <AuthGuard>
                  <BarPage />
                </AuthGuard>
              }
            />
            <Route
              path="/cerveza/:beerLogId"
              element={
                <AuthGuard>
                  <BeerLogPage />
                </AuthGuard>
              }
            />
            <Route
              path="/listas"
              element={
                <AuthGuard>
                  <ListsPage />
                </AuthGuard>
              }
            />
            <Route
              path="/lista/:listId"
              element={
                <AuthGuard>
                  <ListDetailPage />
                </AuthGuard>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
        </BeerProvider>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

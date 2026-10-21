import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { EnquiryModal } from './components/property/EnquiryModal';
import { Property, InquiryType } from './types';
import { getLocalFavorites } from './services/favoriteService';
import { Compass, ArrowLeft } from 'lucide-react';

function AppRouter() {
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [currentSearch, setCurrentSearch] = useState(() => window.location.search || '');
  const [favoritesCount, setFavoritesCount] = useState(() => getLocalFavorites().length);

  // Global Enquiry Modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryProperty, setEnquiryProperty] = useState<Property | null>(null);
  const [enquiryDefaultType, setEnquiryDefaultType] = useState<InquiryType>('viewing');

  // Navigation listener for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentSearch(window.location.search || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    window.history.pushState({}, '', to);
    setCurrentPath(url.pathname);
    setCurrentSearch(url.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFavoritesChanged = useCallback(() => {
    setFavoritesCount(getLocalFavorites().length);
  }, []);

  const handleOpenEnquiry = useCallback((property?: Property | null, type: InquiryType = 'viewing') => {
    setEnquiryProperty(property || null);
    setEnquiryDefaultType(type);
    setEnquiryModalOpen(true);
  }, []);

  // Route guards: never render protected pages until the Supabase session/profile check completes.
  const renderCurrentPage = () => {
    if (isLoading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
          <p className="text-sm text-stone-500">Verifying secure session…</p>
        </div>
      );
    }

    const isAdminOnlyRoute =
      currentPath === '/admin' ||
      ['/dashboard/properties', '/dashboard/inquiries', '/dashboard/users', '/dashboard/analytics', '/dashboard/settings'].includes(currentPath);

    const isUserProtectedRoute = currentPath === '/profile' || currentPath === '/dashboard' || currentPath.startsWith('/dashboard/');
    if (isUserProtectedRoute && !isAuthenticated) {
      if (currentPath !== '/login') handleNavigate('/login?next=' + encodeURIComponent(currentPath));
      return null;
    }

    if (isAdminOnlyRoute && !isAdmin) {
      if (!isAuthenticated) {
        if (currentPath !== '/login') handleNavigate('/login?next=' + encodeURIComponent(currentPath));
        return null;
      }
      return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
          <h2 className="font-serif text-3xl text-stone-900">Access Restricted</h2>
          <p className="text-sm text-stone-500">This page is reserved for authorized administrators.</p>
          <button type="button" onClick={() => handleNavigate('/dashboard')} className="bg-stone-900 text-white px-6 py-3 rounded-full">
            Return to dashboard
          </button>
        </div>
      );
    }
    // 1. Property Detail Page: /property/:slug
    if (currentPath.startsWith('/property/')) {
      const slug = currentPath.replace('/property/', '').trim();
      return (
        <PropertyDetailPage
          slug={slug}
          onNavigate={handleNavigate}
          onOpenEnquiry={prop => handleOpenEnquiry(prop, 'viewing')}
          onFavoritesChanged={handleFavoritesChanged}
        />
      );
    }

    // 2. Exact Path Matches
    switch (currentPath) {
      case '/':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenEnquiry={prop => handleOpenEnquiry(prop, 'general')}
            onFavoritesChanged={handleFavoritesChanged}
          />
        );

      case '/properties':
        return (
          <PropertiesPage
            initialSearchQuery={currentSearch}
            onNavigate={handleNavigate}
            onFavoritesChanged={handleFavoritesChanged}
          />
        );

      case '/about':
        return (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenEnquiry={() => handleOpenEnquiry(null, 'general')}
          />
        );

      case '/contact':
        return <ContactPage />;

      case '/login':
        return <LoginPage onNavigate={handleNavigate} />;

      case '/register':
        return <RegisterPage onNavigate={handleNavigate} />;

      case '/forgot-password':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;

      case '/reset-password':
        return <ResetPasswordPage onNavigate={handleNavigate} />;

      case '/profile':
        if (!isAuthenticated) {
          return (
            <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
              <h2 className="font-serif text-3xl text-stone-900">Private Client Access</h2>
              <p className="text-xs text-stone-500">
                Please sign in to access your confidential profile and preferences.
              </p>
              <button
                type="button"
                onClick={() => handleNavigate('/login')}
                className="bg-stone-900 text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-stone-800 transition-colors"
              >
                Sign In to Portal
              </button>
            </div>
          );
        }
        return <ProfilePage onNavigate={handleNavigate} />;

      case '/dashboard':
      case '/dashboard/properties':
      case '/dashboard/inquiries':
      case '/dashboard/users':
      case '/dashboard/analytics':
      case '/dashboard/settings':
        if (isAdmin) {
          return <AdminDashboardPage onNavigate={handleNavigate} />;
        }
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onFavoritesChanged={handleFavoritesChanged}
          />
        );

      case '/admin':
        if (!isAdmin) {
          return (
            <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
              <h2 className="font-serif text-3xl text-stone-900">Restricted Administration</h2>
              <p className="text-xs text-stone-500">
                Agency credentials with administrative authorization are required to access this console.
              </p>
              <button
                type="button"
                onClick={() => handleNavigate('/login?next=' + encodeURIComponent('/admin'))}
                className="bg-stone-900 text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-stone-800 transition-colors"
              >
                Sign In as Administrator
              </button>
            </div>
          );
        }
        return <AdminDashboardPage onNavigate={handleNavigate} />;

      default:
        return (
          <div className="max-w-3xl mx-auto px-4 py-28 text-center space-y-6">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800">
              404 — Document Not Found
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-stone-900">
              Residence Unattainable
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              The requested address or archive portfolio is not in our active catalogue.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleNavigate('/')}
                className="inline-flex items-center gap-2 bg-stone-900 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-stone-800 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('/properties')}
                className="inline-flex items-center gap-2 bg-stone-100 text-stone-800 text-xs font-bold px-6 py-3 rounded-full hover:bg-stone-200 transition-colors"
              >
                <span>Browse Catalogue</span>
              </button>
            </div>
          </div>
        );
    }
  };

  const isAdminRoute = currentPath === '/admin' || (currentPath.startsWith('/dashboard') && isAdmin);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-800 selection:text-stone-100">
      {/* Top Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        favoritesCount={favoritesCount}
      />

      {/* Main Content View */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Global Footer (omitted on dense admin console) */}
      {!isAdminRoute && <Footer onNavigate={handleNavigate} />}

      {/* Global Client Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        property={enquiryProperty}
        defaultType={enquiryDefaultType}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

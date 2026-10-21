import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getLocalFavorites } from '../../services/favoriteService';
import { siteConfig } from '../../config/site';
import {
  Heart,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, favoritesCount }) => {
  const { user, role, isAdmin, isAuthenticated, signOut, isDemoMode, setDemoRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    onNavigate(path);
  };

  const isHome = currentPath === '/';

  return (
    <>
      {/* Demo Mode Role Switcher Bar (only visible when running in demo/offline mode) */}
      {isDemoMode && (
        <aside aria-label="Demo controls" className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 border-b border-stone-800 flex items-center justify-between z-50 relative">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-medium text-stone-200">Demo Mode Active</span>
            <span className="hidden sm:inline text-stone-400">
              (Simulate roles to test client vs admin features)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400 mr-1">Active Role:</span>
            <button
              type="button"
              onClick={() => setDemoRole('public')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                role === 'public'
                  ? 'bg-stone-700 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Visitor
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('user')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                role === 'user'
                  ? 'bg-stone-700 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                role === 'admin'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-stone-400 hover:text-amber-300'
              }`}
            >
              Admin
            </button>
          </div>
        </aside>
      )}

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-900/90 text-stone-100 backdrop-blur-md shadow-md border-b border-stone-800'
            : isHome
            ? 'bg-stone-950/40 text-stone-100 backdrop-blur-xs border-b border-white/10'
            : 'bg-stone-900 text-stone-100 border-b border-stone-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 border border-stone-400/40 rounded-full flex items-center justify-center font-serif text-xl tracking-widest text-amber-200 group-hover:border-amber-300 transition-colors">
              A
            </div>
            <div>
              <span className="font-serif text-2xl tracking-widest uppercase block leading-none text-stone-100 group-hover:text-amber-100 transition-colors">
                {siteConfig.agency_name}
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400 block mt-1">
                Private Residences
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <button
              type="button"
              onClick={() => handleNavClick('/properties')}
              className={`hover:text-amber-200 transition-colors cursor-pointer ${
                currentPath === '/properties' ? 'text-amber-300 font-semibold' : 'text-stone-300'
              }`}
            >
              Residences
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/properties?listing_status=for_sale')}
              className="text-stone-300 hover:text-amber-200 transition-colors cursor-pointer"
            >
              Acquire (Buy)
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/properties?listing_status=for_rent')}
              className="text-stone-300 hover:text-amber-200 transition-colors cursor-pointer"
            >
              Lease (Rent)
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/about')}
              className={`hover:text-amber-200 transition-colors cursor-pointer ${
                currentPath === '/about' ? 'text-amber-300 font-semibold' : 'text-stone-300'
              }`}
            >
              The Agency
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/contact')}
              className={`hover:text-amber-200 transition-colors cursor-pointer ${
                currentPath === '/contact' ? 'text-amber-300 font-semibold' : 'text-stone-300'
              }`}
            >
              Concierge
            </button>
          </nav>

          {/* Right Action Icons (Favourites & User Menu) */}
          <div className="flex items-center gap-4">
            {/* Favourites Button */}
            <button
              type="button"
              onClick={() => handleNavClick(isAuthenticated ? '/dashboard' : '/properties?filter=saved')}
              className="relative p-2 text-stone-300 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
              title="Saved Residences"
              aria-label={`Saved residences (${favoritesCount})`}
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-xs font-medium cursor-pointer transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                    {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.full_name || 'Account'}</span>
                  {isAdmin && (
                    <span className="bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl py-2 z-50 text-xs animate-fadeIn">
                    <div className="px-4 py-2 border-b border-stone-800">
                      <div className="font-semibold text-white truncate">{user?.full_name || 'User'}</div>
                      <div className="text-stone-400 text-[11px] truncate">{user?.email}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavClick('/dashboard')}
                      className="w-full px-4 py-2 text-left text-stone-200 hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      <span>Client Dashboard</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleNavClick('/admin')}
                        className="w-full px-4 py-2 text-left text-amber-300 hover:bg-stone-800 flex items-center gap-2 cursor-pointer font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Admin Back-Office</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleNavClick('/profile')}
                      className="w-full px-4 py-2 text-left text-stone-200 hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-stone-400" />
                      <span>Account Profile</span>
                    </button>

                    <div className="border-t border-stone-800 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('/login')}
                  className="text-stone-300 hover:text-white text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('/register')}
                  className="bg-stone-100 hover:bg-white text-stone-900 text-xs font-bold px-4 py-2 rounded-full shadow transition-all cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-300 hover:text-white cursor-pointer rounded-lg hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-900 border-b border-stone-800 px-6 py-6 space-y-4 animate-fadeIn">
            <button
              type="button"
              onClick={() => handleNavClick('/properties')}
              className="block w-full text-left py-2 text-base text-stone-200 hover:text-amber-300 font-medium cursor-pointer"
            >
              All Residences
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/properties?listing_status=for_sale')}
              className="block w-full text-left py-2 text-base text-stone-200 hover:text-amber-300 font-medium cursor-pointer"
            >
              Acquire (For Sale)
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/properties?listing_status=for_rent')}
              className="block w-full text-left py-2 text-base text-stone-200 hover:text-amber-300 font-medium cursor-pointer"
            >
              Lease (For Rent)
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/about')}
              className="block w-full text-left py-2 text-base text-stone-200 hover:text-amber-300 font-medium cursor-pointer"
            >
              The Agency
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/contact')}
              className="block w-full text-left py-2 text-base text-stone-200 hover:text-amber-300 font-medium cursor-pointer"
            >
              Concierge Services
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNavClick('/admin')}
                className="block w-full text-left py-2 text-base text-amber-300 font-bold cursor-pointer border-t border-stone-800 pt-3"
              >
                Admin Back-Office
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};

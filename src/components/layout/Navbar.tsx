import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { siteConfig } from '../../config/site';
import { getSiteSettings } from '../../services/settingsService';
import { SiteSettings } from '../../types';
import { Logo } from '../common/Logo';
import {
  Heart,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronDown,
  Sun,
  Moon,
  MessageCircle,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, favoritesCount }) => {
  const { user, role, isAdmin, isAuthenticated, signOut, isDemoMode, setDemoRole } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleSettingsChanged = (e: any) => {
      if (e.detail) {
        setSiteSettings(e.detail);
      } else {
        setSiteSettings(getSiteSettings());
      }
    };
    window.addEventListener('site-settings-changed', handleSettingsChanged);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('site-settings-changed', handleSettingsChanged);
    };
  }, []);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    onNavigate(path);
  };

  const isHome = currentPath === '/';

  // Navigation styles based on Light / Dark theme and scroll state
  const headerBgClass = isDark
    ? isScrolled
      ? 'bg-stone-900/90 text-stone-100 backdrop-blur-md shadow-md border-b border-stone-800'
      : isHome
      ? 'bg-stone-950/80 text-stone-100 backdrop-blur-md border-b border-white/10 shadow-sm'
      : 'bg-stone-900 text-stone-100 border-b border-stone-800'
    : isScrolled
    ? 'bg-[#FBF9F5]/95 text-stone-900 backdrop-blur-md shadow-xs border-b border-amber-900/10'
    : isHome
    ? 'bg-[#FBF9F5]/95 text-stone-900 backdrop-blur-md border-b border-amber-900/10 shadow-2xs'
    : 'bg-[#FBF9F5] text-stone-900 border-b border-amber-900/10';

  const linkBaseClass = isDark
    ? 'text-stone-300 hover:text-amber-200'
    : 'text-stone-700 hover:text-amber-900';

  const linkActiveClass = isDark
    ? 'text-amber-300 font-semibold'
    : 'text-amber-900 font-bold';

  return (
    <>
      {/* Demo Mode Role Switcher Bar */}
      {isDemoMode && (
        <aside
          aria-label="Demo controls"
          className={`text-xs px-4 py-1.5 border-b flex items-center justify-between z-50 relative transition-colors ${
            isDark
              ? 'bg-stone-900 text-stone-300 border-stone-800'
              : 'bg-[#F2EDE4] text-stone-800 border-amber-900/15'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">Demo Mode Active</span>
            <span className={`hidden sm:inline ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              (Simulate roles to test client vs admin features)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] mr-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Role:</span>
            <button
              type="button"
              onClick={() => setDemoRole('public')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                role === 'public'
                  ? isDark
                    ? 'bg-stone-700 text-white font-bold'
                    : 'bg-stone-800 text-white font-bold'
                  : isDark
                  ? 'text-stone-400 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Visitor
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('user')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                role === 'user'
                  ? isDark
                    ? 'bg-stone-700 text-white font-bold'
                    : 'bg-stone-800 text-white font-bold'
                  : isDark
                  ? 'text-stone-400 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => {
                if (isAdmin) {
                  handleNavClick('/admin');
                } else {
                  handleNavClick('/login?next=' + encodeURIComponent('/admin'));
                }
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                role === 'admin'
                  ? 'bg-amber-600 text-white font-bold'
                  : isDark
                  ? 'text-stone-400 hover:text-amber-300'
                  : 'text-amber-800 hover:text-amber-950 font-semibold'
              }`}
            >
              Admin
            </button>
          </div>
        </aside>
      )}

      {/* Top Announcement Banner (Controlled from Admin Settings) */}
      {siteSettings.show_announcement && siteSettings.top_announcement && !announcementDismissed && (
        <aside
          aria-label="Important Announcement"
          className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-amber-100 px-4 py-2 text-xs border-b border-amber-700/60 z-50 relative shadow-xs transition-colors"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-medium overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-gentlePulse shrink-0" />
              <span className="truncate">{siteSettings.top_announcement}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {siteSettings.whatsapp_number && (
                <a
                  href={`https://wa.me/${siteSettings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Office</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setAnnouncementDismissed(true)}
                className="text-amber-200 hover:text-white p-1 rounded-full hover:bg-amber-700/50 cursor-pointer transition-colors"
                title="Dismiss Announcement"
                aria-label="Dismiss Announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Navigation Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${headerBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('/')}
            className="text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-lg"
            aria-label={`${siteSettings.agency_name} Home`}
          >
            <Logo variant="horizontal" size="md" theme={isDark ? 'dark' : 'light'} showTagline={true} />
          </button>

          {/* Desktop Navigation Links with animated underlines */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide">
            <button
              type="button"
              onClick={() => handleNavClick('/properties')}
              className={`group relative py-1 cursor-pointer transition-colors ${
                currentPath === '/properties' ? linkActiveClass : linkBaseClass
              }`}
            >
              <span>Residences</span>
              <span className={`block h-[2px] transition-all duration-300 ${
                currentPath === '/properties' ? 'w-full bg-amber-700 dark:bg-amber-400' : 'w-0 group-hover:w-full bg-amber-600/80 dark:bg-amber-400/80'
              }`} />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/properties?listing_status=for_sale')}
              className={`group relative py-1 ${linkBaseClass} cursor-pointer transition-colors`}
            >
              <span>Acquire (Buy)</span>
              <span className="block h-[2px] w-0 group-hover:w-full bg-amber-600/80 dark:bg-amber-400/80 transition-all duration-300" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/properties?listing_status=for_rent')}
              className={`group relative py-1 ${linkBaseClass} cursor-pointer transition-colors`}
            >
              <span>Lease (Rent)</span>
              <span className="block h-[2px] w-0 group-hover:w-full bg-amber-600/80 dark:bg-amber-400/80 transition-all duration-300" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/about')}
              className={`group relative py-1 cursor-pointer transition-colors ${
                currentPath === '/about' ? linkActiveClass : linkBaseClass
              }`}
            >
              <span>The Agency</span>
              <span className={`block h-[2px] transition-all duration-300 ${
                currentPath === '/about' ? 'w-full bg-amber-700 dark:bg-amber-400' : 'w-0 group-hover:w-full bg-amber-600/80 dark:bg-amber-400/80'
              }`} />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/contact')}
              className={`group relative py-1 cursor-pointer transition-colors ${
                currentPath === '/contact' ? linkActiveClass : linkBaseClass
              }`}
            >
              <span>Concierge</span>
              <span className={`block h-[2px] transition-all duration-300 ${
                currentPath === '/contact' ? 'w-full bg-amber-700 dark:bg-amber-400' : 'w-0 group-hover:w-full bg-amber-600/80 dark:bg-amber-400/80'
              }`} />
            </button>
          </nav>

          {/* Right Action Zone (Theme Toggle, Favourites & User Menu) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button (Light Mode / Dark Mode) with smooth rotation */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`btn-pro p-2 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                isDark
                  ? 'text-amber-300 hover:text-white hover:bg-stone-800'
                  : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/60 border border-amber-900/15'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className="transition-transform duration-500 hover:rotate-90">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </div>
            </button>

            {/* Favourites Button with tactile bounce */}
            <button
              type="button"
              onClick={() => handleNavClick(isAuthenticated ? '/dashboard' : '/properties?filter=saved')}
              className={`btn-pro relative p-2 cursor-pointer rounded-full transition-colors ${
                isDark
                  ? 'text-stone-300 hover:text-white hover:bg-white/10'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/50'
              }`}
              title="Saved Residences"
              aria-label={`Saved residences (${favoritesCount})`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 active:scale-125 ${favoritesCount > 0 ? 'fill-amber-500 text-amber-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center animate-fadeInScale">
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
                  className={`btn-pro flex items-center gap-2 py-1.5 px-3 rounded-full border text-xs font-medium cursor-pointer transition-colors ${
                    isDark
                      ? 'border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-200'
                      : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800 shadow-2xs'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[10px]">
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
                  <div
                    className={`absolute right-0 mt-2 w-56 border rounded-xl shadow-2xl py-2 z-50 text-xs animate-fadeIn ${
                      isDark
                        ? 'bg-stone-900 border-stone-800 text-stone-200'
                        : 'bg-white border-stone-200 text-stone-800 shadow-xl'
                    }`}
                  >
                    <div className={`px-4 py-2 border-b ${isDark ? 'border-stone-800' : 'border-stone-100'}`}>
                      <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>
                        {user?.full_name || 'User'}
                      </div>
                      <div className={`text-[11px] truncate ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {user?.email}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavClick('/dashboard')}
                      className={`w-full px-4 py-2 text-left flex items-center gap-2 cursor-pointer ${
                        isDark ? 'hover:bg-stone-800 text-stone-200' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      <span>Client Dashboard</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleNavClick('/admin')}
                        className={`w-full px-4 py-2 text-left flex items-center gap-2 cursor-pointer font-semibold ${
                          isDark ? 'hover:bg-stone-800 text-amber-300' : 'hover:bg-amber-50 text-amber-900'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Back-Office</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleNavClick('/profile')}
                      className={`w-full px-4 py-2 text-left flex items-center gap-2 cursor-pointer ${
                        isDark ? 'hover:bg-stone-800 text-stone-200' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-stone-400" />
                      <span>Account Profile</span>
                    </button>

                    <div className={`border-t my-1 ${isDark ? 'border-stone-800' : 'border-stone-100'}`} />

                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-red-600 flex items-center gap-2 cursor-pointer ${
                        isDark ? 'hover:bg-stone-800' : 'hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('/login')}
                  className={`text-xs font-semibold px-3 py-1.5 transition-colors cursor-pointer ${
                    isDark ? 'text-stone-300 hover:text-white' : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('/register')}
                  className={`text-xs font-bold px-4 py-2 rounded-full shadow transition-all cursor-pointer ${
                    isDark
                      ? 'bg-stone-100 hover:bg-white text-stone-900'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg cursor-pointer ${
                isDark ? 'text-stone-300 hover:text-white hover:bg-white/10' : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-b px-6 py-6 space-y-4 animate-fadeIn ${
              isDark
                ? 'bg-stone-900 border-stone-800 text-stone-100'
                : 'bg-[#FBF9F5] border-amber-900/15 text-stone-900'
            }`}
          >
            <button
              type="button"
              onClick={() => handleNavClick('/properties')}
              className="block w-full text-left py-2 text-base font-medium hover:text-amber-600 cursor-pointer"
            >
              All Residences
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/properties?listing_status=for_sale')}
              className="block w-full text-left py-2 text-base font-medium hover:text-amber-600 cursor-pointer"
            >
              Acquire (For Sale)
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/properties?listing_status=for_rent')}
              className="block w-full text-left py-2 text-base font-medium hover:text-amber-600 cursor-pointer"
            >
              Lease (For Rent)
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/about')}
              className="block w-full text-left py-2 text-base font-medium hover:text-amber-600 cursor-pointer"
            >
              The Agency
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/contact')}
              className="block w-full text-left py-2 text-base font-medium hover:text-amber-600 cursor-pointer"
            >
              Concierge Services
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNavClick('/admin')}
                className="block w-full text-left py-2 text-base text-amber-600 font-bold cursor-pointer border-t border-stone-200 dark:border-stone-800 pt-3"
              >
                Admin Back-Office
              </button>
            )}

            {!isAuthenticated && (
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => handleNavClick('/login')}
                  className={`w-full text-center py-2.5 rounded-lg border font-medium text-sm transition-colors ${
                    isDark ? 'border-stone-700 text-stone-200' : 'border-stone-300 text-stone-800'
                  }`}
                >
                  Sign In to Account
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('/register')}
                  className="w-full text-center py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md transition-colors"
                >
                  Register Client Profile
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

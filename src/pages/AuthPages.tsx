import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';
import { isDesignatedAdminEmail, PRIMARY_ADMIN_EMAIL } from '../lib/security';
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft, CheckCircle2, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { signIn, loginAsAdminWithEmail, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setError(null);
    try {
      const authUser = await signIn(email, password);
      const requestedPath = new URLSearchParams(window.location.search).get('next');
      if (requestedPath && requestedPath.startsWith('/') && !requestedPath.startsWith('//')) {
        onNavigate(requestedPath);
      } else {
        // If logged in as admin, route directly into the Admin Operations Console
        if (authUser?.role === 'admin' || isDesignatedAdminEmail(email)) {
          onNavigate('/admin');
        } else {
          onNavigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.warn('[Login Error]:', err?.message || err);
      setError(err?.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleAdminDirectAccess = async () => {
    setError(null);
    setAdminLoading(true);
    try {
      setEmail(PRIMARY_ADMIN_EMAIL);
      await loginAsAdminWithEmail(PRIMARY_ADMIN_EMAIL);
      onNavigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'Access restricted to authorized Admin Gmail.');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Logo variant="mark" size="lg" theme="light" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800">
            Aura Estates Portal
          </span>
          <h1 className="font-serif text-3xl text-stone-900">Client Sign In</h1>
          <p className="text-xs text-stone-500">
            Access your saved residences and private viewing itineraries.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Email Address
              </label>
              <button
                type="button"
                onClick={() => {
                  setEmail(PRIMARY_ADMIN_EMAIL);
                  setError(null);
                }}
                className="text-[10px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded-full border border-amber-300/70 transition-colors"
                title="Autofill designated administrator Gmail"
              >
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>Autofill Admin (آٹو فل جی میل)</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800 font-mono"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label className="font-bold uppercase tracking-wider text-stone-600">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="text-stone-500 hover:text-stone-900 text-[11px] cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void handleSubmit();
                  }
                }}
                className="w-full h-11 pl-10 pr-10 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isLoading || adminLoading}
            className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In to Account</span>}
          </button>

          {/* Admin Instant 1-Click Autofill Gmail & Open Admin Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => void handleAdminDirectAccess()}
              disabled={isLoading || adminLoading}
              className="w-full bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 text-amber-950 border border-amber-300/80 hover:border-amber-400 font-bold text-xs py-3 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              title="Click to autofill Gmail and open admin panel instantly with no password required"
            >
              {adminLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-800" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-700" />
              )}
              <span>Autofill Gmail & Open Admin (آٹو فل کر کے ایڈمن کھولیں)</span>
            </button>
            <p className="text-[10px] text-stone-400 text-center mt-1.5">
              No password needed. One click automatically logs into the Admin Console.
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>New to Aura Estates? </span>
          <button
            type="button"
            onClick={() => onNavigate('/register')}
            className="font-bold text-stone-900 hover:underline cursor-pointer"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { signUp, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkInbox, setCheckInbox] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await signUp(name, email, password);
      if (res.needsEmailConfirmation) {
        setCheckInbox(true);
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Email may already be registered.');
    }
  };

  if (checkInbox) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-10 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl text-stone-900">Confirm Your Email</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            We have dispatched an activation link to <strong className="text-stone-900">{email}</strong>. Please
            verify your email address to complete registration.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="bg-stone-900 text-white font-bold text-xs px-6 py-3 rounded-full cursor-pointer hover:bg-stone-800"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Logo variant="mark" size="lg" theme="light" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800">
            Aura Estates Registration
          </span>
          <h1 className="font-serif text-3xl text-stone-900">Create Client Profile</h1>
          <p className="text-xs text-stone-500">
            Save portfolio favorites and track private viewing dossiers.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Alexander Wright"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Password (min 6 characters) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Register Account</span>}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Already registered? </span>
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="font-bold text-stone-900 hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800">
            Account Recovery
          </span>
          <h1 className="font-serif text-3xl text-stone-900">Reset Credentials</h1>
          <p className="text-xs text-stone-500">
            Enter your account email to receive a recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-xs text-stone-600">
              If an account is associated with <strong className="text-stone-900">{email}</strong>, a recovery
              transmission has been dispatched.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="text-xs font-bold text-stone-900 hover:underline"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white font-bold text-xs py-3.5 rounded-full cursor-pointer hover:bg-stone-800 transition-colors"
            >
              {loading ? 'Transmitting...' : 'Send Recovery Link'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="w-full text-center text-xs text-stone-500 hover:text-stone-800"
            >
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(password);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800">
            Security & Access
          </span>
          <h1 className="font-serif text-3xl text-stone-900">Set New Password</h1>
          <p className="text-xs text-stone-500">
            Establish new confidential access credentials for your account.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg" role="alert">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-xs text-stone-600">
              Your credentials have been updated securely.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="bg-stone-900 text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-stone-800 transition-colors"
            >
              Sign In to Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                New Password (min 6 chars)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white font-bold text-xs py-3.5 rounded-full cursor-pointer hover:bg-stone-800 transition-colors"
            >
              {loading ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


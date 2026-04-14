import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EnvelopeSimple,
  LockSimple,
  Eye,
  EyeSlash,
  CarProfile,
  ArrowRight,
  WarningCircle,
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-stretch">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-card via-surface to-surface-elevated" />
        <div className="absolute inset-0 hero-pattern opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-brand-600/10 blur-[80px]" />

        {/* Grid lines decoration */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, #C9A84C 1px, transparent 1px), linear-gradient(to bottom, #C9A84C 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-glow-gold">
            <CarProfile size={22} weight="duotone" className="text-surface" />
          </div>
          <div>
              <p className="font-display font-bold text-white text-lg leading-none">zpluslimo</p>
              <p className="text-gray-500 text-xs mt-0.5">Control Room</p>
          </div>
        </div>

        {/* Center hero */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-slow" />
              Control Room
            </span>
          </div>
          <h1 className="font-display font-bold text-5xl text-white leading-[1.12] mb-6">
            Command Your<br />
            <span className="text-gradient-gold">Fleet</span> with<br />
            Precision.
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Complete visibility and control over your luxury vehicle fleet — bookings,
            drivers, tracking, and revenue all in one intelligent platform.
          </p>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: '250+', label: 'Vehicles' },
              { value: '98%', label: 'Uptime' },
              { value: '24/7', label: 'Support' },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <p className="font-display font-bold text-2xl text-gradient-gold">{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-gray-600 text-xs">
            © 2026 zpluslimo LLC — Dubai, UAE. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right panel – Login form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative">
        <div className="absolute inset-0 bg-surface-card/50" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[400px] mx-auto">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-glow-gold">
              <CarProfile size={18} weight="duotone" className="text-surface" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-base leading-none">zpluslimo</p>
              <p className="text-gray-500 text-[11px]">Control Room</p>
            </div>
          </div>

          <div className="animate-slide-up">
            <h2 className="font-display font-bold text-3xl text-white mb-1">Welcome back</h2>
            <p className="text-gray-400 text-sm mb-8">
              Sign in to your admin account to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <EnvelopeSimple size={18} weight="duotone" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tech@zpluslimo.com"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Password</label>
                  <button type="button" className="text-xs text-gold hover:text-gold-light transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <LockSimple size={18} weight="duotone" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    className="input-field pl-10 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                  <WarningCircle size={18} weight="fill" className="shrink-0" />
                  {error}
                </div>
              )}

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-surface-border bg-surface-elevated accent-gold cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer select-none">
                  Remember this device
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-12 text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Authenticating…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight size={18} weight="bold" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-surface-border">
              <p className="text-center text-xs text-gray-500">
                Need access?{' '}
                <a href="mailto:it@zpluslimo.ae" className="text-gold hover:text-gold-light transition-colors">
                  Contact IT Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

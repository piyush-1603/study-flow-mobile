import { useState } from 'react';
import { Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    // Fake delay for presentation feel
    setTimeout(() => {
      onLogin();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'var(--bg-main)' }}>

      {/* Ambient glow blobs */}
      <div className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6C63FF 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-60px] right-[-40px] w-64 h-64 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FF6584 0%, transparent 70%)' }} />

      <div className="w-full max-w-[430px] h-full flex flex-col justify-center px-7 relative">

        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-10 login-fade-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)',
              boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
            }}>
            <BookOpen size={30} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="ui-display text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>Study Flow</h1>
          <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
            Your smart academic companion
          </p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleLogin} className="login-slide-up">
          <div className="rounded-3xl p-6 glass"
            style={{
              boxShadow: 'var(--shadow-elevated)',
            }}
          >

            <p className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back 👋</p>
            <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
              Sign in to continue to your dashboard
            </p>

            {/* Email */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@university.edu"
                autoComplete="off"
                className="w-full px-4 py-3.5 rounded-2xl text-sm input-focus transition-all"
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="off"
                  className="w-full px-4 py-3.5 rounded-2xl text-sm input-focus transition-all pr-12"
                  style={{
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                >
                  {showPassword
                    ? <EyeOff size={16} className="text-gray-500" />
                    : <Eye size={16} className="text-gray-500" />
                  }
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <button type="button" className="text-xs font-medium" style={{ color: '#6C63FF' }}>
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!email.trim() || !password.trim() || loading}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)',
                boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
              }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="login-spinner" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <LogIn size={16} strokeWidth={2.5} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>

          {/* Sign up hint */}
          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button type="button" className="font-semibold" style={{ color: '#6C63FF' }}>
              Sign up
            </button>
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-[10px] mt-8 login-fade-in-delayed" style={{ color: 'var(--text-tertiary)' }}>
          Study Flow v1.0 · Built for students, by students
        </p>
      </div>
    </div>
  );
}

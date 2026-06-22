import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import ThemeToggle from '../ThemeToggle';

export default function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/portfolio');
    } catch (err: unknown) {
      console.error(err);
      const apiError = err as { response?: { data?: { message?: string } } };
      const msg =
        apiError.response?.data?.message ||
        'Login failed. Please verify credentials or check BE connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      // Passes typed email for SSO simulation, defaults to seeded admin on backend if empty
      await loginWithGoogle(email || undefined);
      navigate('/portfolio');
    } catch (err: unknown) {
      console.error(err);
      const apiError = err as { response?: { data?: { message?: string } } };
      const msg = apiError.response?.data?.message || 'Google Sign In simulation failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-neutral-100 dark:bg-neutral-950 p-4 xs:p-6 sm:p-8 4k:p-24 4k-tv:p-32 transition-colors duration-200">
      <div className="w-full max-w-[320px] xs:max-w-[420px] 4k:max-w-[600px] 4k-tv:max-w-[800px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 xs:p-8 4k:p-12 4k-tv:p-16 shadow-xl dark:shadow-neutral-950/50 transition-all duration-300 hover:shadow-2xl relative">
        {/* Theme Toggler positioned at the top right of the card */}
        <div className="absolute top-4 right-4 xs:top-6 xs:right-6">
          <ThemeToggle />
        </div>

        <div className="mb-6 xs:mb-8 text-center mt-2">
          <div className="inline-flex items-center justify-center font-extrabold text-2xl xs:text-3xl 4k:text-5xl 4k-tv:text-6xl text-brand-navy dark:text-white tracking-tight">
            FACT<span className="text-brand-orange ml-0.5">PULSE</span>
          </div>
          <p className="text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            Delivery Governance Operating System
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-lg p-2.5 mb-4 text-center text-xs xs:text-sm 4k:text-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center w-full py-2.5 px-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl font-semibold text-neutral-700 dark:text-neutral-200 cursor-pointer transition-colors duration-200 disabled:opacity-50"
        >
          <svg className="w-4 h-4 xs:w-4.5 xs:h-4.5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.68 14.93 1 12 1 7.37 1 3.4 3.68 1.48 7.59l3.77 2.93C6.15 7.42 8.87 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.38-4.87 3.38-8.49z"
            />
            <path
              fill="#FBBC05"
              d="M5.25 14.68c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.48 7.12C.53 9.07 0 11.23 0 13.5s.53 4.43 1.48 6.38l3.77-2.93z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.3 1.09-3.7 1.09-3.13 0-5.85-2.38-6.75-5.48L1.08 15.8C3.01 19.72 6.98 23 12 23z"
            />
          </svg>
          Sign in with Google Workspace
        </button>

        <div className="flex items-center text-center my-6 text-neutral-400 dark:text-neutral-500 text-[10px] xs:text-xs 4k:text-base">
          <div className="flex-grow border-b border-neutral-200 dark:border-neutral-800 mr-2"></div>
          or use credentials
          <div className="flex-grow border-b border-neutral-200 dark:border-neutral-800 ml-2"></div>
        </div>

        <form onSubmit={handleEmailSubmit}>
          <div className="mb-4">
            <label
              className="block text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
              htmlFor="email"
            >
              Work Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none transition-shadow focus:ring-2 focus:ring-brand-navy/20 dark:focus:ring-brand-orange/20 focus:border-brand-navy dark:focus:border-brand-orange"
              placeholder="name@factspan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-3 pr-10 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none transition-shadow focus:ring-2 focus:ring-brand-navy/20 dark:focus:ring-brand-orange/20 focus:border-brand-navy dark:focus:border-brand-orange"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 xs:w-5 xs:h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 xs:w-5 xs:h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-brand-navy hover:bg-brand-navy-dark text-white rounded-lg text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl font-semibold cursor-pointer transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 text-[10px] xs:text-xs 4k:text-base text-neutral-400 dark:text-neutral-500 font-medium">
          Need assistance?{' '}
          <a
            href="mailto:support@factspan.com"
            className="text-brand-purple hover:underline font-semibold ml-0.5"
          >
            Contact IT Support
          </a>
        </div>
      </div>
    </div>
  );
}

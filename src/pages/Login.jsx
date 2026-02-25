import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { Captcha } from '../components/Captcha';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isCaptchaValid) {
      setError('Please complete the captcha verification');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-pattern">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-bronze-gold to-goldenrod rounded-full flex items-center justify-center">
                <LogIn size={32} className="text-white" />
              </div>
            </div>
            <h2 className="mb-2">Welcome Back</h2>
            <p className="text-deep-terracotta/60 dark:text-warm-ivory/60">
              Sign in to your HaandiCrafts account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  {error.toLowerCase().includes('blocked') && (
                    <div className="mt-2">
                      <Link
                        to={`/support?email=${encodeURIComponent(email)}`}
                        className="text-sm text-bronze-gold hover:text-goldenrod"
                      >
                        Raise a Support Ticket
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Verification</label>
              <Captcha onVerify={setIsCaptchaValid} />
            </div>

            <button
              type="submit"
              disabled={isLoading || !isCaptchaValid}
              className="w-full py-3 bg-bronze-gold hover:bg-goldenrod text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60">
              Don't have an account?{' '}
              <Link to="/signup" className="text-bronze-gold hover:text-goldenrod">
                Register here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60 hover:text-bronze-gold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
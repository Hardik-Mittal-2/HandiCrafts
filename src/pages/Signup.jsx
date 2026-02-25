import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { Captcha } from '../components/Captcha';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
  });
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (value) => {
    setFormData({ ...formData, password: value });
    
    // Real-time password validation
    const errors = [];
    if (value.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(value)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(value)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(value)) errors.push('One number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) errors.push('One special character');
    
    setPasswordErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isCaptchaValid) {
      setError('Please complete the captcha verification');
      return;
    }

    setIsLoading(true);

    try {
      // Map user-friendly role names to internal role names
      const roleMap = {
        'Customer': 'buyer',
        'Artisan': 'seller',
        'Consultant': 'consultant',
        'Admin': 'admin',
      };
      
      const internalRole = roleMap[formData.role] || 'buyer';
      const signupData = {
        ...formData,
        role: internalRole,
      };
      
      await signup(signupData);
      navigate(internalRole === 'admin' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
                <UserPlus size={32} className="text-white" />
              </div>
            </div>
            <h2 className="mb-2">Create Account</h2>
            <p className="text-deep-terracotta/60 dark:text-warm-ivory/60">
              Join HaandiCrafts community today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm mb-2">
                I am a
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
              >
                <option value="Customer">Customer</option>
                <option value="Artisan">Artisan</option>
                <option value="Consultant">Cultural Consultant</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                placeholder="Create a strong password"
                required
              />
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((err, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-red-600">
                      <AlertCircle size={12} />
                      <span>{err}</span>
                    </div>
                  ))}
                  {passwordErrors.length === 0 && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle size={12} />
                      <span>Password meets all requirements</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                placeholder="Confirm your password"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Verification</label>
              <Captcha onVerify={setIsCaptchaValid} />
            </div>

            <button
              type="submit"
              disabled={isLoading || !isCaptchaValid || passwordErrors.length > 0}
              className="w-full py-3 bg-bronze-gold hover:bg-goldenrod text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Creating Account...'
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-deep-terracotta/60 dark:text-warm-ivory/60">
              Already have an account?{' '}
              <Link to="/login" className="text-bronze-gold hover:text-goldenrod">
                Sign in here
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

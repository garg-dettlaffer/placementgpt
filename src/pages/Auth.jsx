import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Building2, Calendar, ArrowRight, Check, X, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { COLLEGES, BRANCHES, GRADUATION_YEARS } from '../utils/constants';
import { isValidEmail, getPasswordStrength } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isAuthenticated } = useAuth();
  
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    college: '',
    branch: '',
    graduationYear: new Date().getFullYear() + 1,
  });
  
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', checks: {} });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Update form type based on route
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  // Password strength check
  useEffect(() => {
    if (!isLogin && formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    }
  }, [formData.password, isLogin]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.college) newErrors.college = 'College is required';
      if (!formData.branch) newErrors.branch = 'Branch is required';
      if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password);
        if (result.success) {
          navigate('/dashboard');
        }
      } else {
        const result = await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.college,
          formData.branch,
          formData.graduationYear
        );
        if (result.success) {
          navigate('/onboarding');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-dark-950">
      {/* Left Side - Branding & Stats */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gradient">P</span>
            </div>
            <span className="text-2xl font-bold">PlacementGPT</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            ChatGPT Doesn't Know<br />
            <span className="text-cyan-200">Your College. We Do.</span>
          </h1>
          
          <p className="text-lg text-primary-100 max-w-md">
            The only AI placement assistant trained on archives, syllabus, and interview 
            experiences from top Indian engineering colleges.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[
            { value: '2,459', label: 'Students Placed', trend: '+12% this week' },
            { value: '500+', label: 'Top Companies', trend: '' },
            { value: '₹12 LPA', label: 'Avg Package', trend: '' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
            >
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-primary-100">{stat.label}</div>
              {stat.trend && (
                <div className="text-xs text-cyan-200 mt-1">{stat.trend}</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="relative z-10 p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 mt-8">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Sparkles key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-sm italic mb-4">
            "Join the fastest growing placement community"
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white" />
              ))}
            </div>
            <span className="text-xs text-primary-100">+2k members</span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold text-dark-900 dark:text-white">PlacementGPT</span>
          </Link>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-dark-100 dark:bg-dark-900 rounded-lg mb-8">
            <button
              onClick={() => {
                setIsLogin(false);
                navigate('/signup');
              }}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
                !isLogin
                  ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-dark-600 dark:text-dark-400'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setIsLogin(true);
                navigate('/login');
              }}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
                isLogin
                  ? 'bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-dark-600 dark:text-dark-400'
              }`}
            >
              Login
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
                {isLogin ? 'Welcome back!' : 'Create an account'}
              </h2>
              <p className="text-dark-600 dark:text-dark-400 mb-6">
                {isLogin
                  ? 'Enter your details to start your placement journey.'
                  : 'Start your placement journey today.'}
              </p>

              {/* Name (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Aditya Kumar"
                      className={`input-field pl-10 ${errors.name ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-dark-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="aditya@college.edu"
                    className={`input-field pl-10 ${errors.email ? 'input-error' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
              </div>

              {/* College & Branch (Signup only) */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                      College / University
                    </label>
                    <select
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className={`select-field ${errors.college ? 'input-error' : ''}`}
                    >
                      <option value="">Select Branch</option>
                      {COLLEGES.map((college) => (
                        <option key={college} value={college}>
                          {college}
                        </option>
                      ))}
                    </select>
                    {errors.college && <p className="text-xs text-error mt-1">{errors.college}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                      Graduation Year
                    </label>
                    <select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="select-field"
                    >
                      {GRADUATION_YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Branch (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={`select-field ${errors.branch ? 'input-error' : ''}`}
                  >
                    <option value="">Select Branch</option>
                    {BRANCHES.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                  {errors.branch && <p className="text-xs text-error mt-1">{errors.branch}</p>}
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-dark-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={`input-field pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
                
                {/* Password Strength Indicator (Signup only) */}
                {!isLogin && formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-dark-600 dark:text-dark-400">
                        Password strength
                      </span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.strength >= 80 ? 'text-green-600' :
                        passwordStrength.strength >= 60 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-dark-200 dark:bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.strength >= 80 ? 'bg-green-500' :
                          passwordStrength.strength >= 60 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { key: 'length', label: '8+ characters' },
                        { key: 'uppercase', label: 'Uppercase' },
                        { key: 'lowercase', label: 'Lowercase' },
                        { key: 'number', label: 'Number' },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-1 text-xs">
                          {passwordStrength.checks[key] ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-dark-400" />
                          )}
                          <span className={passwordStrength.checks[key] ? 'text-green-600' : 'text-dark-500'}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Terms (Signup only) */}
              {!isLogin && (
                <div className="flex items-start gap-2">
                  <input type="checkbox" required className="checkbox-field mt-1" />
                  <label className="text-xs text-dark-600 dark:text-dark-400">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-300 dark:border-dark-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-dark-950 text-dark-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Footer Note */}
          <p className="text-xs text-center text-dark-500 dark:text-dark-400 mt-8">
            © 2024 PlacementGPT. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

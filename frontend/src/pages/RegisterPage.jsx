import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_SALES'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(formData.username, formData.password, formData.role);
    
    if (result.success) {
      setSuccess('Registration successful! Please sign in with your credentials.');
      // Clear form
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'ROLE_SALES'
      });
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const pageVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-md">
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-8 border border-secondary-100"
          variants={cardVariants}
          style={{ perspective: 1000 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div 
              className="mb-4"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-600 to-primary-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">🏭</span>
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-600 to-primary-700 bg-clip-text text-transparent mb-2">
              Join Sam Composite
            </h1>
            <p className="text-secondary-600">Create your account to get started</p>
          </motion.div>

          {/* Alert Messages */}
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-accent-50 border border-accent-200 rounded-xl text-accent-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div 
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </motion.div>
          )}

          {/* Register Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-secondary-700 mb-2">
                Username
              </label>
              <motion.input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={3}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl bg-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your username"
                variants={inputVariants}
                whileFocus="focus"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-secondary-700 mb-2">
                Password
              </label>
              <motion.input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl bg-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                variants={inputVariants}
                whileFocus="focus"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-secondary-700 mb-2">
                Confirm Password
              </label>
              <motion.input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl bg-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirm your password"
                variants={inputVariants}
                whileFocus="focus"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-secondary-700 mb-2">
                Role
              </label>
              <motion.select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                variants={inputVariants}
                whileFocus="focus"
              >
                <option value="ROLE_SALES">Sales</option>
                <option value="ROLE_ADMIN">Admin</option>
              </motion.select>
              <p className="mt-2 text-sm text-secondary-500">
                Note: If no admin exists, the first user will automatically become admin.
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-accent-600 to-accent-700 text-white font-semibold rounded-xl shadow-lg hover:from-accent-700 hover:to-accent-800 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              variants={buttonVariants}
              whileHover={!loading ? "hover" : {}}
              whileTap={!loading ? "tap" : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <p className="text-secondary-600">
              Already have an account?{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="/login" 
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-300"
                >
                  Sign in here
                </a>
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
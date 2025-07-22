import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import HRSignup from './HRSignup';
import StudentSignup from './StudentSignup';

const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const signInSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const signUpSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<'student' | 'hr'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const signInForm = useForm({
    resolver: yupResolver(signInSchema),
  });

  const signUpForm = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const resetForms = () => {
    signUpForm.reset();
    signInForm.reset();
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setUserType('student');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForms();
  };

  const handleSignIn = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      await signIn(data.email, data.password);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      await signUp(data.email, data.password);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* User Type Toggle */}
                <div className="mb-6">
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setUserType('student')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        userType === 'student'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('hr')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        userType === 'hr'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      HR Professional
                    </button>
                  </div>
                </div>

                {isSignUp ? (
                  userType === 'hr' ? (
                    <HRSignup onSuccess={handleClose} />
                  ) : (
                    <StudentSignup onSuccess={handleClose} />
                  )
                ) : (
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        {...signInForm.register('email')}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {signInForm.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-1">{signInForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          {...signInForm.register('password')}
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {signInForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1">{signInForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={switchMode}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
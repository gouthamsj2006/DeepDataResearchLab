import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Users, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const signUpSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.string().required('Role is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

const signInSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHRLogin?: () => void;
}

export default function AuthModal({ isOpen, onClose, onHRLogin }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();

  const signUpForm = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signInForm = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignUp = async (data: any) => {
    setLoading(true);
    setError('');
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            auth_user_id: authData.user.id,
            full_name: data.fullName,
            phone_number: data.phoneNumber,
            email: data.email,
            role: data.role,
          });

        if (profileError) throw profileError;
      }
      
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = '✅ Successfully registered!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 5000);
      
      if (data.role === 'HR' && onHRLogin) {
        onHRLogin();
      }
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (data: any) => {
    setLoading(true);
    setError('');
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Check user role from profile
      if (authData.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('auth_user_id', authData.user.id)
          .single();

        if (profile?.role === 'HR' && onHRLogin) {
          onHRLogin();
        }
      }
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    signUpForm.reset();
    signInForm.reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    signUpForm.reset();
    signInForm.reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[90vw] sm:w-[350px] max-h-[90vh] overflow-y-auto hide-scrollbar bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {isSignUp ? (
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        {...signUpForm.register('fullName')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your full name"
                      />
                      {signUpForm.formState.errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.fullName.message}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        {...signUpForm.register('phoneNumber')}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="+1234567890"
                      />
                      {signUpForm.formState.errors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.phoneNumber.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        {...signUpForm.register('email')}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your email"
                      />
                      {signUpForm.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        I am a
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="relative cursor-pointer">
                          <input
                            {...signUpForm.register('role')}
                            type="radio"
                            value="HR"
                            className="sr-only peer"
                          />
                          <div className="flex items-center justify-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20">
                            <div className="text-center">
                              <Briefcase className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">HR Professional</span>
                            </div>
                          </div>
                        </label>
                        <label className="relative cursor-pointer">
                          <input
                            {...signUpForm.register('role')}
                            type="radio"
                            value="Student"
                            className="sr-only peer"
                          />
                          <div className="flex items-center justify-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20">
                            <div className="text-center">
                              <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">Student</span>
                            </div>
                          </div>
                        </label>
                      </div>
                      {signUpForm.formState.errors.role && (
                        <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.role.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          {...signUpForm.register('password')}
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {signUpForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          {...signUpForm.register('confirmPassword')}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {signUpForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>
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
                        placeholder="Enter your email"
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
                          placeholder="Enter your password"
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

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>
                )}

                {/* Toggle between Sign In and Sign Up */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
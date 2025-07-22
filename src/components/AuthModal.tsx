@@ .. @@
 import React, { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { X, Eye, EyeOff } from 'lucide-react';
 import { useForm } from 'react-hook-form';
 import { yupResolver } from '@hookform/resolvers/yup';
 import * as yup from 'yup';
 import { useAuth } from '../hooks/useAuth';
+import HRSignup from './HRSignup';
+import StudentSignup from './StudentSignup';
 
 const countryCodes = [
   { code: '+91', country: 'India', flag: '🇮🇳' },
@@ .. @@
 export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
   const [isSignUp, setIsSignUp] = useState(false);
+  const [userType, setUserType] = useState<'student' | 'hr'>('student');
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [loading, setLoading] = useState(false);
@@ .. @@
   const resetForms = () => {
     signUpForm.reset();
     signInForm.reset();
     setError('');
     setShowPassword(false);
     setShowConfirmPassword(false);
+    setUserType('student');
   };
 
   const handleClose = () => {
@@ .. @@
               <div className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
-                    {isSignUp ? 'Create Account' : 'Welcome Back'}
+                    {isSignUp ? 'Create Account' : 'Sign In'}
                   </h2>
                   <button
                     onClick={handleClose}
@@ .. @@
                   </div>
                 )}
 
+                {/* User Type Toggle */}
+                <div className="mb-6">
+                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
+                    <button
+                      type="button"
+                      onClick={() => setUserType('student')}
+                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
+                        userType === 'student'
+                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
+                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
+                      }`}
+                    >
+                      Student
+                    </button>
+                    <button
+                      type="button"
+                      onClick={() => setUserType('hr')}
+                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
+                        userType === 'hr'
+                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
+                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
+                      }`}
+                    >
+                      HR Professional
+                    </button>
+                  </div>
+                </div>
+
                 {isSignUp ? (
-                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
+                  userType === 'hr' ? (
+                    <HRSignup onSuccess={handleClose} />
+                  ) : (
+                    <StudentSignup onSuccess={handleClose} />
+                  )
+                ) : (
+                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
+                    {/* Email */}
+                    <div>
+                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
+                        Email
+                      </label>
+                      <input
+                        {...signInForm.register('email')}
+                        type="email"
+                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
+                      />
+                      {signInForm.formState.errors.email && (
+                        <p className="text-red-500 text-xs mt-1">{signInForm.formState.errors.email.message}</p>
+                      )}
+                    </div>
+
+                    {/* Password */}
+                    <div>
+                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
+                        Password
+                      </label>
+                      <div className="relative">
+                        <input
+                          {...signInForm.register('password')}
+                          type={showPassword ? 'text' : 'password'}
+                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
+                        />
+                        <button
+                          type="button"
+                          onClick={() => setShowPassword(!showPassword)}
+                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
+                        >
+                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
+                        </button>
+                      </div>
+                      {signInForm.formState.errors.password && (
+                        <p className="text-red-500 text-xs mt-1">{signInForm.formState.errors.password.message}</p>
+                      )}
+                    </div>
+
+                    {/* Submit button */}
+                    <button
+                      type="submit"
+                      disabled={loading}
+                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
+                    >
+                      {loading ? 'Signing In...' : 'Sign In'}
+                    </button>
+                  </form>
+                )}
+
+                <div className="mt-6 text-center">
+                  <button
+                    onClick={switchMode}
+                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
+                  >
+                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
+                  </button>
+                </div>
+              </div>
+            </motion.div>
+          </motion.div>
+        )}
+      </AnimatePresence>
+    </>
+  );
+}
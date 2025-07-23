@@ .. @@
 import React, { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
-import { X, Eye, EyeOff } from 'lucide-react';
+import { X, Eye, EyeOff, Users, Briefcase } from 'lucide-react';
 import { useForm } from 'react-hook-form';
 import { yupResolver } from '@hookform/resolvers/yup';
 import * as yup from 'yup';
 import { useAuth } from '../hooks/useAuth';
 
-const countryCodes = [
-  { code: '+91', country: 'India', flag: '🇮🇳' },
-  { code: '+1', country: 'USA', flag: '🇺🇸' },
-  { code: '+44', country: 'UK', flag: '🇬🇧' },
-  { code: '+86', country: 'China', flag: '🇨🇳' },
-  { code: '+81', country: 'Japan', flag: '🇯🇵' },
-];
-
-const degrees = [
-  'B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'BE', 'ME', 
-  'BCA', 'MCA', 'BBA', 'MBA', 'BA', 'MA'
-];
-
-const signUpSchema = yup.object({
-  fullName: yup.string().required('Full name is required'),
-  age: yup.number().required('Age is required').min(16, 'Must be at least 16').max(100, 'Must be less than 100'),
-  countryCode: yup.string().required('Country code is required'),
-  phoneNumber: yup.string().required('Phone number is required'),
+const signUpSchema = yup.object({
+  fullName: yup.string().required('Full name is required'),
+  phoneNumber: yup.string().required('Phone number is required'),
   email: yup.string().email('Invalid email').required('Email is required'),
-  degree: yup.string().required('Degree is required'),
+  role: yup.string().required('Role is required'),
   password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
   confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
 });
@@ .. @@
 interface AuthModalProps {
   isOpen: boolean;
   onClose: () => void;
+  onHRLogin?: () => void;
 }
 
-export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
+export default function AuthModal({ isOpen, onClose, onHRLogin }: AuthModalProps) {
   const [isSignUp, setIsSignUp] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
@@ .. @@
   const signUpForm = useForm({
     resolver: yupResolver(signUpSchema),
     defaultValues: {
       fullName: '',
-      age: '',
-      countryCode: '+91',
       phoneNumber: '',
       email: '',
-      degree: '',
+      role: '',
       password: '',
       confirmPassword: '',
     },
@@ .. @@
   const handleSignUp = async (data: any) => {
     setLoading(true);
     setError('');
     
     try {
-      await signUp(data.email, data.password, {
+      const { data: authData, error: authError } = await supabase.auth.signUp({
+        email: data.email,
+        password: data.password,
+        options: {
+          data: {
+            full_name: data.fullName,
+            role: data.role,
+          }
+        }
+      });
+
+      if (authError) throw authError;
+
+      if (authData.user) {
+        // Create user profile
+        const { error: profileError } = await supabase
+          .from('user_profiles')
+          .insert({
+            auth_user_id: authData.user.id,
+            full_name: data.fullName,
+            phone_number: data.phoneNumber,
+            email: data.email,
+            role: data.role,
+          });
+
+        if (profileError) throw profileError;
+      }
+      
+      const toast = document.createElement('div');
+      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
+      toast.textContent = '✅ Successfully registered!';
+      document.body.appendChild(toast);
+      setTimeout(() => document.body.removeChild(toast), 5000);
+      
+      if (data.role === 'HR' && onHRLogin) {
+        onHRLogin();
+      }
+      
+      onClose();
+    } catch (err: any) {
+      setError(err.message || 'An error occurred during sign up');
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleSignIn = async (data: any) => {
+    setLoading(true);
+    setError('');
+    
+    try {
+      const { data: authData, error } = await supabase.auth.signInWithPassword({
+        email: data.email,
+        password: data.password,
+      });
+
+      if (error) throw error;
+
+      // Check user role
+      if (authData.user?.user_metadata?.role === 'HR' && onHRLogin) {
+        onHRLogin();
+      }
+      
+      onClose();
+    } catch (err: any) {
+      setError(err.message || 'An error occurred during sign in');
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleSignUp = async (data: any) => {
+    setLoading(true);
+    setError('');
+    
+    try {
+      await signUp(data.email, data.password, {
         fullName: data.fullName,
-        age: parseInt(data.age),
-        phoneNumber: `${data.countryCode}${data.phoneNumber}`,
+        phoneNumber: data.phoneNumber,
         email: data.email,
-        degree: data.degree,
+        role: data.role,
       });
       
       const toast = document.createElement('div');
@@ .. @@
           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
           onClick={handleClose}
         >
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.9, opacity: 0 }}
-            className="w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto hide-scrollbar bg-white dark:bg-gray-800 rounded-xl shadow-md"
+            className="w-[90vw] sm:w-[350px] max-h-[90vh] overflow-y-auto hide-scrollbar bg-white dark:bg-gray-800 rounded-xl shadow-md"
             onClick={(e) => e.stopPropagation()}
             style={hideScrollbarStyle}
           >
@@ .. @@
                     {/* Full Name */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         Full Name
                       </label>
                       <input
                         {...signUpForm.register('fullName')}
                         type="text"
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                       />
                       {signUpForm.formState.errors.fullName && (
                         <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.fullName.message}</p>
                       )}
                     </div>

-                    {/* Age */}
-                    <div>
-                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
-                        Age
-                      </label>
-                      <input
-                        {...signUpForm.register('age')}
-                        type="number"
-                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
-                      />
-                      {signUpForm.formState.errors.age && (
-                        <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.age.message}</p>
-                      )}
-                    </div>
-
                     {/* Phone Number */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         Phone Number
                       </label>
-                      <div className="flex space-x-2">
-                        <select
-                          {...signUpForm.register('countryCode')}
-                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
-                        >
-                          {countryCodes.map((country) => (
-                            <option key={country.code} value={country.code}>
-                              {country.flag} {country.code}
-                            </option>
-                          ))}
-                        </select>
-                        <input
-                          {...signUpForm.register('phoneNumber')}
-                          type="tel"
-                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
-                        />
-                      </div>
+                      <input
+                        {...signUpForm.register('phoneNumber')}
+                        type="tel"
+                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
+                        placeholder="+1234567890"
+                      />
                       {signUpForm.formState.errors.phoneNumber && (
                         <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.phoneNumber.message}</p>
                       )}
@@ .. @@
                       )}
                     </div>

-                    {/* Degree */}
+                    {/* Role Selection */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
-                        Degree
+                        I am a
                       </label>
-                      <select
-                        {...signUpForm.register('degree')}
-                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
-                      >
-                        <option value="">Select your degree</option>
-                        {degrees.map((degree) => (
-                          <option key={degree} value={degree}>
-                            {degree}
-                          </option>
-                        ))}
-                      </select>
-                      {signUpForm.formState.errors.degree && (
-                        <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.degree.message}</p>
+                      <div className="grid grid-cols-2 gap-3">
+                        <label className="relative">
+                          <input
+                            {...signUpForm.register('role')}
+                            type="radio"
+                            value="HR"
+                            className="sr-only"
+                          />
+                          <div className="flex items-center justify-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20">
+                            <div className="text-center">
+                              <Briefcase className="w-6 h-6 mx-auto mb-2 text-blue-600" />
+                              <span className="text-sm font-medium text-gray-900 dark:text-white">HR Professional</span>
+                            </div>
+                          </div>
+                        </label>
+                        <label className="relative">
+                          <input
+                            {...signUpForm.register('role')}
+                            type="radio"
+                            value="Student"
+                            className="sr-only"
+                          />
+                          <div className="flex items-center justify-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20">
+                            <div className="text-center">
+                              <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
+                              <span className="text-sm font-medium text-gray-900 dark:text-white">Student</span>
+                            </div>
+                          </div>
+                        </label>
+                      </div>
+                      {signUpForm.formState.errors.role && (
+                        <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.role.message}</p>
                       )}
                     </div>
@@ .. @@
 }
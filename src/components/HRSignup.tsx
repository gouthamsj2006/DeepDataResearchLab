import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Building, MapPin, User, Mail, Lock, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { supabase } from '../lib/supabase';

const companyTypes = [
  'Startup',
  'MNC',
  'Government',
  'Non-Profit',
  'Consulting',
  'Product Company',
  'Service Company',
  'E-commerce',
  'Fintech',
  'Healthcare',
  'Education'
];

const domains = [
  'Software Engineering',
  'Data Engineering',
  'Product Management',
  'Quality Assurance',
  'DevOps',
  'UI/UX Design',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Cloud Engineering',
  'Mobile Development',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Business Analysis',
  'Project Management'
];

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  companyName: yup.string().required('Company name is required'),
  location: yup.string().required('Location is required'),
  companyType: yup.string().required('Company type is required'),
  domain: yup.string().required('Domain is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface HRSignupProps {
  onSuccess: () => void;
}

export default function HRSignup({ onSuccess }: HRSignupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            user_type: 'hr',
            name: data.name,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create HR profile
        const { error: profileError } = await supabase
          .from('hr_profiles')
          .insert({
            auth_user_id: authData.user.id,
            name: data.name,
            email: data.email,
            company_name: data.companyName,
            location: data.location,
            company_type: data.companyType,
            domain: data.domain,
          });

        if (profileError) throw profileError;

        // Store HR session in localStorage with JWT token
        const hrUser = {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          company_name: data.companyName,
          location: data.location,
          company_type: data.companyType,
          domain: data.domain,
          user_type: 'hr'
        };

        localStorage.setItem('hr_user', JSON.stringify(hrUser));
        
        // Store JWT token for dev testing
        if (authData.session?.access_token) {
          localStorage.setItem('supabase.auth.token', authData.session.access_token);
        }

        // Show success message
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        toast.textContent = '✅ HR account created successfully! Redirecting to HireDeck...';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);

        // Redirect to HireDeck in new tab after short delay
        setTimeout(() => {
          window.open('/hiredeck', '_blank');
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            {...register('name')}
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your full name"
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            {...register('email')}
            type="email"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Company Name
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            {...register('companyName')}
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter company name"
          />
        </div>
        {errors.companyName && (
          <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            {...register('location')}
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="City, Country"
          />
        </div>
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
        )}
      </div>

      {/* Company Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Company Type
        </label>
        <select
          {...register('companyType')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select company type</option>
          {companyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.companyType && (
          <p className="text-red-500 text-xs mt-1">{errors.companyType.message}</p>
        )}
      </div>

      {/* Domain */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Primary Domain
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            {...register('domain')}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select primary domain</option>
            {domains.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
        {errors.domain && (
          <p className="text-red-500 text-xs mt-1">{errors.domain.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
      >
        {loading ? 'Creating HR Account...' : 'Create HR Account'}
      </motion.button>
    </form>
  );
}
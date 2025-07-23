import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Save, Loader2, LogOut, User, Phone, Mail, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
  onSignOut: () => void;
import ImageUploader from './ImageUploader';

export default function ProfilePopup({ isOpen, onClose, userProfile, onProfileUpdate, onSignOut }: ProfilePopupProps) {
  const [loading, setLoading] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [userRole, setUserRole] = useState('Loading...');
  const [courseEnrollment, setCourseEnrollment] = useState('Loading...');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: '',
    email: ''
  });

  const { user } = useAuth();

  // Fetch user profile data
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, phone_number, role, email, id')
        .eq('auth_user_id', user.id)
        .single();

      if (profile) {
        setFormData({
          name: profile.full_name,
          phone: profile.phone_number,
          role: profile.role || 'Student',
          email: profile.email
        });

        setUserRole(profile.role || 'Student');

        // Only check for course enrollment if user is a Student
        if (profile.role === 'Student') {
          const enrollmentTables = [
            'data_engineering_enrollments',
            'service_delivery_enrollments',
            'dba_enrollments',
            'devops_enrollments',
            'business_analysis_enrollments',
          ];

          for (const table of enrollmentTables) {
            const { data } = await supabase
              .from(table)
              .select('selected_course')
              .eq('user_id', profile.id)
              .maybeSingle();

            if (data?.selected_course) {
              setCourseEnrollment(data.selected_course);
              return;
            }
          }
          setCourseEnrollment('No Enrollment');
        } else {
          setCourseEnrollment('N/A (HR User)');
        }

      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.name,
          phone_number: formData.phone,
        })
        .eq('auth_user_id', user.id);

      if (error) throw error;

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-[90vw] sm:w-[400px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Settings
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <button
                    onClick={() => setShowImageUploader(true)}
                    className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Click camera to change photo
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Role
                  </label>
                  <input
                    type="text"
                    value={userRole}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Role cannot be changed after registration
                  </p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Course Enrollment
                  </label>
                  <input
                    type="text"
                    value={courseEnrollment}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {userRole === 'HR' ? 'HR users do not have course enrollments' : 'Based on your course enrollments'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <ImageUploader
          isOpen={showImageUploader}
          onClose={() => setShowImageUploader(false)}
          onUpload={(url) => {
            console.log('Image uploaded:', url);
            setShowImageUploader(false);
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
-import { X, Camera, Save, Loader2, LogOut } from 'lucide-react';
+import { X, Camera, Save, Loader2, LogOut, User, Phone, Mail, Briefcase } from 'lucide-react';
 import { useAuth } from '../hooks/useAuth';
 import { supabase } from '../lib/supabase';
 import ImageUploader from './ImageUploader';
@@ .. @@
   const [loading, setLoading] = useState(false);
   const [showImageUploader, setShowImageUploader] = useState(false);
-  const [course, setCourse] = useState('Loading...');
+  const [userRole, setUserRole] = useState('Loading...');
+  const [courseEnrollment, setCourseEnrollment] = useState('Loading...');
   const [formData, setFormData] = useState({
     name: '',
-    phone: ''
+    phone: '',
+    role: ''
   });

   const { user } = useAuth();

-  // Fetch user profile and selected course
+  // Fetch user profile data
   useEffect(() => {
     if (!user?.id) return;

     const fetchProfile = async () => {
       const { data: profile } = await supabase
         .from('user_profiles')
-        .select('full_name, phone_number, id')
+        .select('full_name, phone_number, role, id')
         .eq('auth_user_id', user.id)
         .single();

       if (profile) {
         setFormData({
           name: profile.full_name,
           phone: profile.phone_number,
+          role: profile.role || user.user_metadata?.role || 'Student'
         });

-        // Try enrollment tables one by one
-        const enrollmentTables = [
-          'data_engineering_enrollments',
-          'service_delivery_enrollments',
-          'dba_enrollments',
-          'devops_enrollments',
-          'business_analysis_enrollments',
-        ];
-
-        for (const table of enrollmentTables) {
-          const { data } = await supabase
-            .from(table)
-            .select('selected_course')
-            .eq('user_id', profile.id)
-            .maybeSingle();
-
-          if (data?.selected_course) {
-            setCourse(data.selected_course);
-            return;
+        setUserRole(profile.role || user.user_metadata?.role || 'Student');
+
+        // Only check for course enrollment if user is a Student
+        if (profile.role === 'Student' || user.user_metadata?.role === 'Student') {
+          const enrollmentTables = [
+            'data_engineering_enrollments',
+            'service_delivery_enrollments',
+            'dba_enrollments',
+            'devops_enrollments',
+            'business_analysis_enrollments',
+          ];
+
+          for (const table of enrollmentTables) {
+            const { data } = await supabase
+              .from(table)
+              .select('selected_course')
+              .eq('user_id', profile.id)
+              .maybeSingle();
+
+            if (data?.selected_course) {
+              setCourseEnrollment(data.selected_course);
+              return;
+            }
           }
+          setCourseEnrollment('No Enrollment');
+        } else {
+          setCourseEnrollment('N/A (HR User)');
         }

-        setCourse('No Enrollment');
       }
     };

@@ .. @@
       const { error } = await supabase
         .from('user_profiles')
         .update({
           full_name: formData.name,
           phone_number: formData.phone,
+          role: formData.role,
         })
         .eq('auth_user_id', user.id);

       if (error) throw error;
@@ .. @@
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.9, opacity: 0 }}
-            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
+            className="w-[90vw] sm:w-[400px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
             onClick={(e) => e.stopPropagation()}
           >
             <div className="p-6">
@@ .. @@
               {/* Form Fields */}
               <div className="space-y-4">
                 <div>
-                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
+                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
+                    <User className="w-4 h-4 mr-2" />
                     Full Name
                   </label>
                   <input
@@ -165,7 +165,8 @@
                 </div>

                 <div>
-                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
+                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
+                    <Phone className="w-4 h-4 mr-2" />
                     Phone Number
                   </label>
                   <input
@@ -178,7 +179,8 @@
                 </div>

                 <div>
-                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
+                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
+                    <Mail className="w-4 h-4 mr-2" />
                     Email
                   </label>
                   <input
@@ -190,15 +192,32 @@
                   />
                 </div>

+                <div>
+                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
+                    <Briefcase className="w-4 h-4 mr-2" />
+                    Role
+                  </label>
+                  <select
+                    value={formData.role}
+                    onChange={(e) => handleInputChange('role', e.target.value)}
+                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
+                  >
+                    <option value="Student">Student</option>
+                    <option value="HR">HR Professional</option>
+                  </select>
+                </div>
+
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
-                    Selected Course
+                    Course Enrollment
                   </label>
                   <input
                     type="text"
-                    value={course}
+                    value={courseEnrollment}
                     readOnly
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                   />
+                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
+                    {userRole === 'HR' ? 'HR users do not have course enrollments' : 'Based on your course enrollments'}
+                  </p>
                 </div>
@@ .. @@
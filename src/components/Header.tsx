@@ .. @@
 import { useState, useRef, useEffect } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
-import { Search, User, ChevronDown, LogOut, Camera } from 'lucide-react';
+import { Search, User, ChevronDown, LogOut, Camera, ExternalLink } from 'lucide-react';
 import { useAuth } from '../hooks/useAuth';
 import { supabase } from '../lib/supabase';
 import AuthModal from './AuthModal';
 import ProfilePopup from './ProfilePopup';
@@ .. @@
   const [showAuthModal, setShowAuthModal] = useState(false);
   const [showProfilePopup, setShowProfilePopup] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [userProfile, setUserProfile] = useState<any>(null);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   
   const { user, signOut } = useAuth();

   // Fetch user profile data
@@ .. @@
     }
   };

+  const handleHireDeckClick = () => {
+    if (!user) {
+      setShowAuthModal(true);
+      return;
+    }
+
+    // Check user role
+    if (user.user_metadata?.role === 'HR') {
+      window.open('/hiredeck', '_blank');
+    } else {
+      // Show toast for non-HR users
+      const toast = document.createElement('div');
+      toast.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
+      toast.textContent = '⚠️ Please sign in as HR to access HireDeck';
+      document.body.appendChild(toast);
+      setTimeout(() => document.body.removeChild(toast), 5000);
+    }
+  };
+
+  const handleHRLogin = () => {
+    window.open('/hiredeck', '_blank');
+  };
+
   const courses = [
@@ .. @@
               <button
                 onClick={() => onNavigate('about')}
                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
               >
                 About
               </button>
-              <a
-                href="/hiredeck"
-                target="_blank"
-                rel="noopener noreferrer"
+              <button
+                onClick={handleHireDeckClick}
                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
               >
-                HireDeck
-              </a>
+                <span className="flex items-center space-x-1">
+                  <span>HireDeck</span>
+                  <ExternalLink className="w-3 h-3" />
+                </span>
+              </button>
             </nav>
@@ .. @@
                     className="text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                   >
                     About
                   </button>
+                  <button
+                    onClick={() => {
+                      handleHireDeckClick();
+                      setIsMobileMenuOpen(false);
+                    }}
+                    className="text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center space-x-2"
+                  >
+                    <span>HireDeck</span>
+                    <ExternalLink className="w-3 h-3" />
+                  </button>
                 </nav>
@@ .. @@
       <AuthModal 
         isOpen={showAuthModal} 
         onClose={() => setShowAuthModal(false)} 
+        onHRLogin={handleHRLogin}
       />

       <ProfilePopup
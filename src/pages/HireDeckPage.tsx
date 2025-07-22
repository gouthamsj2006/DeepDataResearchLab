@@ .. @@
 import React, { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
-import HireDeckHeader from '../components/HireDeck/HireDeckHeader';
-import HireDeckDashboard from '../components/HireDeck/HireDeckDashboard';
-import HRSignup from '../components/HireDeck/HRSignup';
-import StudentSignup from '../components/HireDeck/StudentSignup';
+import HireDeckHeader from '../components/HireDeckHeader';
+import HireDeckDashboard from '../components/HireDeckDashboard';
+import HRSignup from '../components/HRSignup';
+import StudentSignup from '../components/StudentSignup';
 
 type ViewMode = 'dashboard' | 'hr-signup' | 'student-signup';
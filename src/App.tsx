@@ .. @@
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import { useAuth } from './hooks/useAuth';
 import { useTheme } from './hooks/useTheme';
 import Header from './components/Header';
 import Hero from './components/Hero';
 import Courses from './components/Courses';
 import Contact from './components/Contact';
 import Footer from './components/Footer';
 import AppThemeWrapper from './components/AppThemeWrapper'
 import HireDeckPage from './pages/HireDeckPage';
+import { Navigate } from 'react-router-dom';

 function App() {
 }
@@ .. @@
         <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
           <Routes>
             <Route path="/hiredeck" element={<HireDeckPage />} />
+            <Route path="*" element={<Navigate to="/" replace />} />
             <Route path="/" element={
               <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
                 <Header onNavigate={handleNavigate} />
           }
           }
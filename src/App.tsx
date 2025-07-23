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

function App() {
  const { loading } = useAuth();
  const { isDark } = useTheme();

  const handleNavigate = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <AppThemeWrapper>
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
          <Routes>
            <Route path="/hiredeck" element={<HireDeckPage />} />
            <Route path="/" element={
              <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
                <Header onNavigate={handleNavigate} />
                <Hero />
                <Courses />
                <Contact />
                <Footer />
              </div>
            } />
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Page not found</p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </AppThemeWrapper>
    </Router>
  );
}

export default App;
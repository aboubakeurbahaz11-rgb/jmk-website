import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import News from './pages/News';
import Matches from './pages/Matches';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch global appearance on load
    const applyAppearance = async () => {
      try {
        const res = await API.get('/settings/appearance');
        const colors = res.data;
        if (colors && colors.goldColor) {
          document.documentElement.style.setProperty('--gold', colors.goldColor);
          document.documentElement.style.setProperty('--bg-primary', colors.bgColor);
          document.documentElement.style.setProperty('--bg-secondary', colors.bg2Color);
          document.documentElement.style.setProperty('--text', colors.textColor);
        }
      } catch (err) {}
    };

    applyAppearance();
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <LoadingScreen isLoading={isLoading} />
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/news" element={<News />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(245, 197, 24, 0.25)',
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl',
            },
            success: {
              iconTheme: { primary: '#f5c518', secondary: '#1a1a1a' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1a1a1a' },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;

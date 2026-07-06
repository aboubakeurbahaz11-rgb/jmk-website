import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaFacebook, FaShieldAlt } from 'react-icons/fa';

const navLinks = [
  { name: 'الرئيسية', path: '/' },
  { name: 'الأخبار', path: '/news' },
  { name: 'المباريات', path: '/matches' },
  { name: 'الصور', path: '/gallery' },
  { name: 'من نحن', path: '/about' },
  { name: 'تواصل معنا', path: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-xl shadow-lg shadow-black/50 border-b border-yellow-500/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="JMK"
                  className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div>
                <span className="text-xl md:text-2xl font-black gold-text">JMK</span>
                <p className="text-white/50 text-xs hidden md:block">شباب مزاب الخروب</p>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 nav-link-animated
                    ${location.pathname === link.path
                      ? 'text-yellow-400 bg-yellow-500/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1CySPaU5QY/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-blue-400 transition-colors p-2"
                title="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <Link
                to="/register"
                className="hidden md:block btn-gold text-sm py-2 px-5"
              >
                انضم إلى الفريق
              </Link>
              {/* Admin Button - Desktop */}
              <Link
                to="/admin"
                title="لوحة المسؤول"
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-200"
              >
                <FaShieldAlt size={15} />
              </Link>
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-white/70 hover:text-yellow-400 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/98 backdrop-blur-xl border-b border-yellow-500/20 lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200
                    ${location.pathname === link.path
                      ? 'text-yellow-400 bg-yellow-500/10'
                      : 'text-white/70'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/register" className="btn-gold mt-3 justify-center">
                انضم إلى الفريق
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-2 mt-2 px-4 py-3 rounded-xl font-semibold text-yellow-500 border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors"
              >
                <FaShieldAlt /> لوحة المسؤول
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

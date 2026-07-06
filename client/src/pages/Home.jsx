import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaUsers, FaFutbol, FaStar, FaFacebook, FaWhatsapp, FaLock } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import API from '../utils/api';
import { useState } from 'react';

// Floating particle
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ background: 'rgba(245,197,24,0.15)', ...style }}
    animate={{ y: [0, -40, 0], opacity: [0.1, 0.5, 0.1] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
  />
);

const StatCard = ({ icon, value, label, suffix = '' }) => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass-card gold-border p-6 text-center"
    >
      <div className="text-yellow-400 flex justify-center mb-3 text-3xl">{icon}</div>
      <div className="text-4xl font-black gold-text mb-1">
        {count}{suffix}
      </div>
      <p className="text-white/60 text-sm font-medium">{label}</p>
    </motion.div>
  );
};

const Home = () => {
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [news, setNews] = useState([]);
  const [loadingReg, setLoadingReg] = useState(true);

  useEffect(() => {
    API.get('/settings/registration')
      .then(res => setRegistrationOpen(res.data.registrationOpen))
      .catch(() => setRegistrationOpen(true))
      .finally(() => setLoadingReg(false));
    API.get('/news?limit=3')
      .then(res => setNews(res.data.news || []))
      .catch(() => {});
  }, []);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    width: Math.random() * 8 + 3,
    height: Math.random() * 8 + 3,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  }));

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,197,24,0.06) 0%, transparent 70%),
                linear-gradient(180deg, #080808 0%, #0f0f0f 100%)
              `,
            }}
          />
          {/* Field lines decoration */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <rect x="100" y="50" width="1000" height="700" fill="none" stroke="#f5c518" strokeWidth="2" />
            <circle cx="600" cy="400" r="120" fill="none" stroke="#f5c518" strokeWidth="2" />
            <circle cx="600" cy="400" r="5" fill="#f5c518" />
            <line x1="600" y1="50" x2="600" y2="750" stroke="#f5c518" strokeWidth="2" />
            <rect x="100" y="270" width="150" height="260" fill="none" stroke="#f5c518" strokeWidth="2" />
            <rect x="950" y="270" width="150" height="260" fill="none" stroke="#f5c518" strokeWidth="2" />
            <rect x="100" y="320" width="70" height="160" fill="none" stroke="#f5c518" strokeWidth="2" />
            <rect x="1030" y="320" width="70" height="160" fill="none" stroke="#f5c518" strokeWidth="2" />
          </svg>
          {/* Particles */}
          {particles.map((p, i) => (
            <Particle key={i} style={{ width: p.width, height: p.height, left: p.left, top: p.top }} />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'backOut' }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #f5c518, transparent, #f5c518)',
                  margin: '-3px',
                  borderRadius: '50%',
                }}
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src="/logo.png"
                  alt="JMK شباب مزاب الخروب"
                  className="w-36 h-36 md:w-48 md:h-48 object-contain rounded-full relative z-10 p-1"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="w-36 h-36 md:w-48 md:h-48 rounded-full relative z-10 items-center justify-center text-5xl font-black gold-text border-2 border-yellow-500/50"
                  style={{ display: 'none', background: 'rgba(0,0,0,0.7)' }}
                >
                  JMK
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Club name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-3 shimmer-text leading-none tracking-tight">
              JMK
            </h1>
            <h2 className="text-xl md:text-3xl font-bold text-white/90 mb-2">
              Jeunesse Mzab El Khroub
            </h2>
            <p className="text-lg md:text-xl text-yellow-400/80 font-semibold mb-3">
              شباب مزاب الخروب
            </p>
            <div className="flex items-center justify-center gap-2 mb-10">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500/60" />
              <span className="text-white/40 text-sm">التربية • الرياضة • الكفاءة</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500/60" />
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {!loadingReg && (
              registrationOpen ? (
                <Link to="/register" className="btn-gold text-lg py-4 px-10 animate-pulse-gold">
                  <FaFutbol />
                  انضم إلى الفريق
                </Link>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card border border-yellow-500/20 px-8 py-6 text-center max-w-md"
                >
                  <FaLock className="text-yellow-500 text-3xl mx-auto mb-3" />
                  <h3 className="text-yellow-400 text-xl font-bold mb-2">🔒 التسجيلات مغلقة حالياً</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    شكراً لاهتمامكم بالانضمام إلى فريق JMK شباب مزاب الخروب ❤️
                    <br />
                    تابعوا الصفحة لمعرفة موعد التسجيل القادم.
                  </p>
                  <a
                    href="https://www.facebook.com/share/1CySPaU5QY/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    <FaFacebook />
                    تابعنا على فيسبوك
                  </a>
                </motion.div>
              )
            )}

            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/1CySPaU5QY/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600/40 transition-all hover:scale-110"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://wa.me/213773171283"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-600/40 transition-all hover:scale-110"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-yellow-500/30 flex justify-center pt-2">
            <div className="w-1 h-3 bg-yellow-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-20 px-4 bg-dark-800 border-y border-yellow-500/10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title gold-text">إنجازاتنا</h2>
            <p className="text-white/50">أرقام تتحدث عن نفسها</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<FaTrophy />} value={12} label="بطولات محلية" />
            <StatCard icon={<FaUsers />} value={150} label="لاعب نشيط" suffix="+" />
            <StatCard icon={<FaFutbol />} value={8} label="سنوات من الكرة" />
            <StatCard icon={<FaStar />} value={5} label="فئات عمرية" />
          </div>
        </div>
      </section>

      {/* ===== NEWS SECTION ===== */}
      {news.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title gold-text">آخر الأخبار</h2>
                <p className="text-white/50">تابع كل جديد الفريق</p>
              </div>
              <Link to="/news" className="btn-outline text-sm py-2 px-5">
                عرض الكل
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="glass-card gold-border overflow-hidden group"
                >
                  {item.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-xs text-yellow-500 font-semibold uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-white font-bold mt-2 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-white/50 text-sm line-clamp-3">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== JOIN CTA (bottom) ===== */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(245,197,24,0.05) 0%, transparent 100%)' }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FaFutbol className="text-yellow-500 text-5xl mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-4 gold-text">
              هل أنت مستعد للانضمام؟
            </h2>
            <p className="text-white/60 mb-8 text-lg leading-relaxed">
              انضم إلى عائلة JMK وكن جزءاً من مستقبل كرة القدم في الخروب
            </p>
            {registrationOpen ? (
              <Link to="/register" className="btn-gold text-lg py-4 px-12">
                <FaFutbol />
                سجّل الآن
              </Link>
            ) : (
              <p className="text-yellow-500/70 font-semibold">التسجيلات مغلقة حالياً — تابع صفحتنا للإعلان عن الدورة القادمة</p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

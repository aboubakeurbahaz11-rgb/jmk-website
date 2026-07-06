import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card gold-border p-10"
      >
        <div className="w-24 h-24 bg-red-500/10 rounded-full border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-500 text-5xl">
          <FaExclamationTriangle />
        </div>
        
        <h1 className="text-6xl font-black gold-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">الصفحة غير موجودة</h2>
        <p className="text-white/60 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
        
        <Link to="/" className="btn-gold justify-center py-3 w-full">
          <FaHome /> العودة للرئيسية
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

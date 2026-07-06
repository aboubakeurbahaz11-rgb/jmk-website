import { motion } from 'framer-motion';
import { FaFutbol, FaTrophy, FaUsers, FaHistory } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import API from '../utils/api';

const About = () => {
  const [data, setData] = useState({
    name: 'JMK - شباب مزاب الخروب', fullName: '', founded: '', city: '', country: '',
    description: '', vision: '', colors: '', stadium: '', email: '', phone: '',
    facebook: '', whatsapp: '', achievements: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/settings/about');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="spinner"></div></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black gold-text mb-4"
          >
            من نحن
          </motion.h1>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-lg text-white/80 leading-relaxed"
          >
            <h2 className="text-3xl font-bold text-white mb-6">فريق {data.name}</h2>
            <p className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl">
              {data.description}
            </p>
            <p>
              تأسس الفريق سنة <span className="gold-text font-bold text-xl px-1">{data.founded}</span> في مدينة <span className="text-white font-bold">{data.city}</span>.
            </p>
            
            <div className="flex gap-4 pt-4">
              <div className="glass-card gold-border p-4 flex-1 text-center">
                <FaFutbol className="text-yellow-500 text-3xl mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">الألوان</h4>
                <p className="text-sm text-white/50">{data.colors}</p>
              </div>
              <div className="glass-card gold-border p-4 flex-1 text-center">
                <FaHistory className="text-yellow-500 text-3xl mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1">التأسيس</h4>
                <p className="text-sm text-white/50">{data.founded}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
            <img 
              src="/logo.png" 
              alt="JMK Logo" 
              className="relative w-2/3 md:w-3/4 mx-auto object-contain drop-shadow-[0_0_30px_rgba(245,197,24,0.3)] animate-[float_6s_ease-in-out_infinite]"
            />
          </motion.div>
        </div>

        {/* Vision */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card gold-border p-8 md:p-12 text-center mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />
          
          <h3 className="text-2xl font-bold gold-text mb-6">رؤيتنا وأهدافنا</h3>
          <p className="text-xl md:text-2xl leading-relaxed text-white/90 relative z-10 max-w-4xl mx-auto">
            "{data.vision}"
          </p>
        </motion.div>

        {/* Stats */}
        {data.achievements && data.achievements.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.achievements.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 text-center hover:border-yellow-500/30 transition-colors"
              >
                <div className="text-4xl md:text-5xl font-black gold-text mb-2">{item.value}</div>
                <div className="text-sm font-bold text-white/60">{item.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;

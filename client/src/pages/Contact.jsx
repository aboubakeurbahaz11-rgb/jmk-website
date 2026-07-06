import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import API from '../utils/api';

const Contact = () => {
  const [data, setData] = useState({
    phone: '', email: '', address: '', facebook: '', whatsapp: '', instagram: '', youtube: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/settings/contact');
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
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black gold-text mb-4"
          >
            تواصل معنا
          </motion.h1>
          <p className="text-white/50">نحن هنا للإجابة على استفساراتكم</p>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card gold-border p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
              <FaPhone className="text-yellow-500 text-2xl" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">رقم الهاتف</h3>
            <p className="text-white/60 font-mono text-lg" dir="ltr">{data.phone}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card gold-border p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
              <FaEnvelope className="text-yellow-500 text-2xl" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">البريد الإلكتروني</h3>
            <a href={`mailto:${data.email}`} className="text-white/60 hover:text-yellow-400 transition-colors block truncate">{data.email}</a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card gold-border p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
              <FaMapMarkerAlt className="text-yellow-500 text-2xl" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">العنوان</h3>
            <p className="text-white/60">{data.address}</p>
          </motion.div>
        </div>

        <div className="glass-card gold-border p-10 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">تابعنا على شبكات التواصل</h2>
          <div className="flex justify-center gap-6">
            {data.facebook && (
              <a href={data.facebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#1877F2] hover:text-white text-white/50 transition-all duration-300 hover:scale-110">
                <FaFacebook size={28} />
              </a>
            )}
            {data.whatsapp && (
              <a href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white text-white/50 transition-all duration-300 hover:scale-110">
                <FaWhatsapp size={28} />
              </a>
            )}
            {data.instagram && (
              <a href={data.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#E4405F] hover:text-white text-white/50 transition-all duration-300 hover:scale-110">
                <FaInstagram size={28} />
              </a>
            )}
            {data.youtube && (
              <a href={data.youtube} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#FF0000] hover:text-white text-white/50 transition-all duration-300 hover:scale-110">
                <FaYoutube size={28} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

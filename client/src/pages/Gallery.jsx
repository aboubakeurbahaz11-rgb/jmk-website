import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaImage } from 'react-icons/fa';
import API from '../utils/api';

const Gallery = () => {
  const [selected, setSelected] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await API.get('/gallery');
        setGalleryItems(res.data);
      } catch (err) {
        console.error('Error fetching gallery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black gold-text mb-3"
          >
            معرض الصور
          </motion.h1>
          <p className="text-white/50">لحظات لا تُنسى من مسيرة فريق JMK شباب مزاب الخروب</p>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-4" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="spinner" /></div>
        ) : galleryItems.length === 0 ? (
          <div className="glass-card gold-border p-10 text-center max-w-lg mx-auto">
            <FaImage className="text-6xl text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">المعرض فارغ حالياً</h3>
            <p className="text-white/50">سيتم إضافة صور الفريق قريباً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {galleryItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 10) * 0.08 }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 bg-black/50"
                onClick={() => setSelected(item)}
              >
                {/* Image */}
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                {/* Label overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <p className="text-white font-bold text-lg leading-tight">{item.title}</p>
                </div>

                {/* Corner badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-yellow-500/80 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <FaImage size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-yellow-500/30 bg-black flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-1 overflow-hidden flex items-center justify-center relative">
                  <img src={selected.imageUrl} alt={selected.title} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="bg-gradient-to-t from-zinc-900 to-black p-6 border-t border-white/10 shrink-0">
                  <p className="text-white text-xl font-bold">{selected.title}</p>
                  <p className="text-yellow-400 text-sm mt-1 flex items-center gap-2">
                    <FaImage /> JMK - شباب مزاب الخروب
                  </p>
                </div>
                
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 hover:text-red-400 transition-colors"
                >
                  <FaTimes />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;

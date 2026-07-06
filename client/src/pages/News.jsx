import { motion } from 'framer-motion';
import { FaCalendarAlt, FaChevronLeft, FaTag } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import API from '../utils/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await API.get('/news');
        setNews(res.data.news);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black gold-text mb-4"
          >
            آخر الأخبار
          </motion.h1>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="spinner"></div></div>
        ) : news.length === 0 ? (
          <div className="glass-card p-10 text-center text-white/50">لا توجد أخبار حالياً.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, i) => (
              <motion.article 
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="glass-card gold-border overflow-hidden group flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-white/5 flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-yellow-500/20 text-6xl font-black">JMK</div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <FaTag /> {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
                    <FaCalendarAlt className="text-yellow-500" />
                    <span>{new Date(item.createdAt).toLocaleDateString('ar-DZ')}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-white/60 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                    {item.content}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center text-yellow-500 font-bold text-sm group-hover:translate-x-[-5px] transition-transform">
                    اقرأ المزيد <FaChevronLeft className="mr-2 text-xs" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;

import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import API from '../utils/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // '' (all), 'upcoming', 'completed'

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await API.get(`/matches${filter ? `?status=${filter}` : ''}`);
        setMatches(res.data.matches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [filter]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black gold-text mb-4"
          >
            المباريات والنتائج
          </motion.h1>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto" />
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { id: '', label: 'الكل' },
            { id: 'upcoming', label: 'المباريات القادمة' },
            { id: 'completed', label: 'النتائج السابقة' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                filter === f.id
                  ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(245,197,24,0.4)]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Matches List */}
        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="spinner"></div></div>
        ) : matches.length === 0 ? (
          <div className="glass-card p-10 text-center text-white/50">لا توجد مباريات حالياً.</div>
        ) : (
          <div className="space-y-6">
            {matches.map((match, i) => (
              <motion.div
                key={match._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card gold-border p-6 relative overflow-hidden group"
              >
                {match.status === 'live' && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg animate-pulse">
                    مباشر 🔴
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Match Info */}
                  <div className="flex-1 text-center md:text-right space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs text-yellow-400 font-bold border border-yellow-500/20">
                      <FaTrophy /> {match.competition || 'مباراة ودية'}
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-white/60 text-sm">
                      {match.date && <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(match.date).toLocaleDateString('ar')}</span>}
                      {match.venue && <span className="flex items-center gap-1"><FaMapMarkerAlt /> {match.venue}</span>}
                    </div>
                  </div>

                  {/* Score Board */}
                  <div className="flex items-center justify-center gap-4 w-full md:w-auto">
                    <div className="text-xl md:text-2xl font-black text-white w-32 text-center truncate">{match.homeTeam}</div>
                    
                    <div className="bg-black/50 px-6 py-3 rounded-xl border border-white/10 flex flex-col items-center justify-center min-w-[100px]">
                      {(match.status === 'completed' || match.status === 'live') && match.homeScore != null && match.awayScore != null ? (
                        <div className="text-3xl font-black gold-text tracking-widest">{match.homeScore} - {match.awayScore}</div>
                      ) : (
                        <div className="text-xl font-bold text-white/40">VS</div>
                      )}
                    </div>
                    
                    <div className="text-xl md:text-2xl font-black text-white/70 w-32 text-center truncate">{match.awayTeam}</div>
                  </div>

                  {/* Status */}
                  <div className="flex-1 text-center md:text-left">
                    <span className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${
                      match.status === 'completed' ? 'bg-white/10 text-white/50' :
                      match.status === 'live' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {match.status === 'upcoming' ? 'موعد قادم' : match.status === 'completed' ? 'انتهت' : match.status === 'live' ? 'جارية الآن' : 'ملغاة'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;

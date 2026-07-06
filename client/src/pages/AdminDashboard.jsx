import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSignOutAlt, FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaTrash, 
  FaEye, FaToggleOn, FaToggleOff, FaShieldAlt, FaImages, FaCog, FaCloudUploadAlt,
  FaNewspaper, FaFutbol, FaInfoCircle, FaPhone, FaPalette, FaLock, FaChartBar,
  FaEdit, FaPlus, FaSave, FaEyeSlash, FaKey, FaWpforms, FaToggleOn as FaOn
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { admin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');

  // ---- Shared state ----
  const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0, pending: 0, newRequests: 0 });
  const [players, setPlayers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [regOpen, setRegOpen] = useState(true);

  // ---- News ----
  const [newsList, setNewsList] = useState([]);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: 'عام', isPublished: true });
  const [newsImage, setNewsImage] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const newsFileRef = useRef(null);

  // ---- Matches ----
  const [matchesList, setMatchesList] = useState([]);
  const [matchForm, setMatchForm] = useState({ homeTeam: 'JMK شباب مزاب الخروب', awayTeam: '', date: '', venue: '', competition: '', status: 'upcoming', homeScore: '', awayScore: '' });
  const [editingMatch, setEditingMatch] = useState(null);

  // ---- Gallery ----
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryFile, setGalleryFile] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const galleryFileRef = useRef(null);

  // ---- About ----
  const [aboutData, setAboutData] = useState({});
  const [savingAbout, setSavingAbout] = useState(false);

  // ---- Contact ----
  const [contactData, setContactData] = useState({});
  const [savingContact, setSavingContact] = useState(false);

  // ---- Appearance ----
  const [appearance, setAppearance] = useState({
    goldColor: '#f5c518', bgColor: '#0a0a0a', bg2Color: '#141414',
    textColor: '#f6f4ee', accentGreen: '#1e6b3e', accentRed: '#b3413a'
  });
  const [savingAppearance, setSavingAppearance] = useState(false);

  // ---- Form Fields ----
  const [formFields, setFormFields] = useState([]);
  const [savingFields, setSavingFields] = useState(false);

  // ---- Security ----
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [changingPass, setChangingPass] = useState(false);

  const fetchAll = async () => {
    setFetching(true);
    try {
      const [statsRes, playersRes, regRes, newsRes, matchRes, gallRes, aboutRes, contactRes, appRes, fieldsRes] = await Promise.all([
        API.get('/players/stats'),
        API.get(`/players?status=${statusFilter}`),
        API.get('/settings/registration'),
        API.get('/news/all'),
        API.get('/matches'),
        API.get('/gallery'),
        API.get('/settings/about'),
        API.get('/settings/contact'),
        API.get('/settings/appearance'),
        API.get('/settings/form-fields'),
      ]);
      setStats(statsRes.data);
      setPlayers(playersRes.data.players || []);
      setRegOpen(regRes.data.registrationOpen);
      setNewsList(newsRes.data.news || []);
      setMatchesList(matchRes.data.matches || []);
      setGalleryItems(gallRes.data || []);
      setAboutData(aboutRes.data || {});
      setContactData(contactRes.data || {});
      setAppearance(appRes.data || appearance);
      setFormFields(fieldsRes.data || []);
    } catch (err) {
      toast.error('فشل في جلب بعض البيانات');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { if (admin) fetchAll(); }, [admin, statusFilter]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>;
  if (!admin) return <Navigate to="/admin/login" />;

  // ============ PLAYERS ============
  const handleStatusChange = async (id, status) => {
    try { await API.patch(`/players/${id}/status`, { status }); toast.success('تم التحديث'); fetchAll(); } catch { toast.error('فشل'); }
  };
  const handleDeletePlayer = async (id) => {
    if (!window.confirm('حذف هذا الطلب؟')) return;
    try { await API.delete(`/players/${id}`); toast.success('تم الحذف'); fetchAll(); } catch { toast.error('فشل'); }
  };
  const markAsRead = async (id) => {
    try { await API.patch(`/players/${id}/read`); setPlayers(p => p.map(x => x._id === id ? {...x, isRead: true} : x)); } catch {}
  };
  const toggleReg = async () => {
    try { await API.patch('/settings/registration', { value: !regOpen }); setRegOpen(!regOpen); toast.success(regOpen ? 'تم إغلاق التسجيل' : 'تم فتح التسجيل'); } catch { toast.error('خطأ'); }
  };

  // ============ NEWS ============
  const submitNews = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(newsForm).forEach(([k, v]) => fd.append(k, v));
    if (newsImage) fd.append('image', newsImage);
    try {
      if (editingNews) {
        await API.put(`/news/${editingNews._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('تم تعديل الخبر');
      } else {
        await API.post('/news', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('تم إضافة الخبر');
      }
      setNewsForm({ title: '', content: '', category: 'عام', isPublished: true });
      setNewsImage(null); setEditingNews(null);
      if (newsFileRef.current) newsFileRef.current.value = '';
      fetchAll();
    } catch { toast.error('فشل في حفظ الخبر'); }
  };
  const editNews = (n) => { setEditingNews(n); setNewsForm({ title: n.title, content: n.content, category: n.category, isPublished: n.isPublished }); };
  const deleteNews = async (id) => {
    if (!window.confirm('حذف هذا الخبر؟')) return;
    try { await API.delete(`/news/${id}`); toast.success('تم الحذف'); fetchAll(); } catch { toast.error('فشل'); }
  };
  const togglePublish = async (id) => {
    try { await API.patch(`/news/${id}/publish`); fetchAll(); } catch { toast.error('فشل'); }
  };

  // ============ MATCHES ============
  const submitMatch = async (e) => {
    e.preventDefault();
    try {
      if (editingMatch) {
        await API.put(`/matches/${editingMatch._id}`, matchForm);
        toast.success('تم تعديل المباراة');
      } else {
        await API.post('/matches', matchForm);
        toast.success('تم إضافة المباراة');
      }
      setMatchForm({ homeTeam: 'JMK شباب مزاب الخروب', awayTeam: '', date: '', venue: '', competition: '', status: 'upcoming', homeScore: '', awayScore: '' });
      setEditingMatch(null);
      fetchAll();
    } catch { toast.error('فشل في حفظ المباراة'); }
  };
  const editMatch = (m) => { setEditingMatch(m); setMatchForm({ homeTeam: m.homeTeam, awayTeam: m.awayTeam, date: m.date ? m.date.split('T')[0] : '', venue: m.venue || '', competition: m.competition || '', status: m.status, homeScore: m.homeScore ?? '', awayScore: m.awayScore ?? '' }); };
  const deleteMatch = async (id) => {
    if (!window.confirm('حذف هذه المباراة؟')) return;
    try { await API.delete(`/matches/${id}`); toast.success('تم الحذف'); fetchAll(); } catch { toast.error('فشل'); }
  };

  // ============ GALLERY ============
  const uploadGallery = async (e) => {
    e.preventDefault();
    if (!galleryFile || !galleryTitle) { toast.error('يرجى إدخال العنوان والصورة'); return; }
    setUploadingImg(true);
    const fd = new FormData();
    fd.append('title', galleryTitle); fd.append('image', galleryFile);
    try { await API.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('تم رفع الصورة'); setGalleryTitle(''); setGalleryFile(null); if (galleryFileRef.current) galleryFileRef.current.value = ''; fetchAll(); }
    catch { toast.error('فشل في رفع الصورة'); }
    finally { setUploadingImg(false); }
  };
  const deleteGallery = async (id) => {
    if (!window.confirm('حذف هذه الصورة؟')) return;
    try { await API.delete(`/gallery/${id}`); toast.success('تم الحذف'); fetchAll(); } catch { toast.error('فشل'); }
  };

  // ============ ABOUT ============
  const saveAbout = async () => {
    setSavingAbout(true);
    try { await API.put('/settings/about', aboutData); toast.success('تم حفظ معلومات النادي'); } catch { toast.error('فشل في الحفظ'); }
    finally { setSavingAbout(false); }
  };

  // ============ CONTACT ============
  const saveContact = async () => {
    setSavingContact(true);
    try { await API.put('/settings/contact', contactData); toast.success('تم حفظ معلومات التواصل'); } catch { toast.error('فشل في الحفظ'); }
    finally { setSavingContact(false); }
  };

  // ============ APPEARANCE ============
  const applyAppearance = (colors) => {
    document.documentElement.style.setProperty('--gold', colors.goldColor);
    document.documentElement.style.setProperty('--bg-primary', colors.bgColor);
    document.documentElement.style.setProperty('--bg-secondary', colors.bg2Color);
    document.documentElement.style.setProperty('--text', colors.textColor);
  };
  const saveAppearance = async () => {
    setSavingAppearance(true);
    try { await API.put('/settings/appearance', appearance); applyAppearance(appearance); toast.success('تم تطبيق المظهر الجديد'); } catch { toast.error('فشل في الحفظ'); }
    finally { setSavingAppearance(false); }
  };
  const resetAppearance = () => {
    const defaults = { goldColor: '#f5c518', bgColor: '#0a0a0a', bg2Color: '#141414', textColor: '#f6f4ee', accentGreen: '#1e6b3e', accentRed: '#b3413a' };
    setAppearance(defaults); applyAppearance(defaults);
  };

  // ============ FORM FIELDS ============
  const toggleField = (id) => setFormFields(f => f.map(x => x.id === id ? {...x, enabled: !x.enabled} : x));
  const toggleRequired = (id) => setFormFields(f => f.map(x => x.id === id ? {...x, required: !x.required} : x));
  const saveFields = async () => {
    setSavingFields(true);
    try { await API.put('/settings/form-fields', formFields); toast.success('تم حفظ حقول الاستمارة'); } catch { toast.error('فشل'); }
    finally { setSavingFields(false); }
  };

  // ============ SECURITY ============
  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) { toast.error('كلمتا المرور الجديدتان غير متطابقتين'); return; }
    if (passwords.newPass.length < 6) { toast.error('يجب أن تكون كلمة المرور 6 أحرف على الأقل'); return; }
    setChangingPass(true);
    try {
      await API.post('/auth/change-password', { currentPassword: passwords.current, newPassword: passwords.newPass });
      toast.success('تم تغيير كلمة المرور بنجاح!');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل في تغيير كلمة المرور');
    }
    finally { setChangingPass(false); }
  };

  // ===== REUSABLE COMPONENTS =====
  const StatBox = ({ title, value, icon, color }) => (
    <div className="glass-card gold-border p-5 flex items-center justify-between">
      <div><p className="text-white/50 text-sm mb-1">{title}</p><h4 className={`text-3xl font-black ${color}`}>{value}</h4></div>
      <div className={`text-3xl ${color}`}>{icon}</div>
    </div>
  );

  const InputField = ({ label, value, onChange, type='text', placeholder='', required=false }) => (
    <div>
      <label className="block text-white/70 text-sm font-bold mb-1">{label}</label>
      <input type={type} className="input-field" value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </div>
  );

  const tabs = [
    { id: 'requests', label: 'الاستمارة', icon: <FaWpforms /> },
    { id: 'stats', label: 'الإحصائيات', icon: <FaChartBar /> },
    { id: 'news', label: 'الأخبار', icon: <FaNewspaper /> },
    { id: 'matches', label: 'المباريات', icon: <FaFutbol /> },
    { id: 'gallery', label: 'المعرض', icon: <FaImages /> },
    { id: 'about', label: 'عن النادي', icon: <FaInfoCircle /> },
    { id: 'contact', label: 'التواصل', icon: <FaPhone /> },
    { id: 'form-fields', label: 'بناء الاستمارة', icon: <FaEdit /> },
    { id: 'appearance', label: 'المظهر', icon: <FaPalette /> },
    { id: 'security', label: 'الأمن', icon: <FaLock /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-10 px-2 md:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 glass-card p-4 border border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30">
              <FaShieldAlt className="text-yellow-500 text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-black gold-text">لوحة إدارة JMK</h1>
              <p className="text-white/40 text-xs">التحكم الكامل في الموقع</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/20 text-sm transition-colors">
            <FaSignOutAlt /> خروج
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2 hide-scrollbar">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold whitespace-nowrap text-sm transition-all border ${
                activeTab === t.id 
                  ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40 shadow-md shadow-yellow-500/10' 
                  : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

            {/* ======== TAB: REQUESTS ======== */}
            {activeTab === 'requests' && (
              <div>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                  <h2 className="text-xl font-bold gold-text flex items-center gap-2"><FaWpforms />طلبات الانضمام</h2>
                  <button onClick={toggleReg}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-bold text-sm ${
                      regOpen ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-red-500/50 text-red-400 bg-red-500/10'
                    }`}>
                    {regOpen ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                    {regOpen ? 'التسجيل مفتوح — اضغط للإغلاق' : 'التسجيل مغلق — اضغط للفتح'}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <StatBox title="الإجمالي" value={stats.total} icon={<FaUsers />} color="text-blue-400" />
                  <StatBox title="جديدة" value={stats.newRequests} icon={<FaClock />} color="text-yellow-400" />
                  <StatBox title="مقبولين" value={stats.accepted} icon={<FaCheckCircle />} color="text-green-400" />
                  <StatBox title="مرفوضين" value={stats.rejected} icon={<FaTimesCircle />} color="text-red-400" />
                </div>
                <div className="glass-card gold-border overflow-hidden">
                  <div className="p-3 border-b border-white/5 flex gap-2 overflow-x-auto">
                    {['', 'pending', 'accepted', 'rejected'].map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${statusFilter===s?'bg-yellow-500 text-black':'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                        {s===''?'الكل':s==='pending'?'انتظار':s==='accepted'?'مقبول':'مرفوض'}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right admin-table text-sm">
                      <thead><tr><th>الصورة</th><th>الاسم</th><th>العمر</th><th>المركز</th><th>الفئة</th><th>الحالة</th><th className="text-center">إجراءات</th></tr></thead>
                      <tbody>
                        {fetching ? (<tr><td colSpan="7" className="text-center py-8"><div className="spinner mx-auto"/></td></tr>)
                        : players.length===0 ? (<tr><td colSpan="7" className="text-center py-8 text-white/40">لا توجد طلبات</td></tr>)
                        : players.map(p => (
                          <tr key={p._id} className={!p.isRead?'bg-yellow-500/5':''}>
                            <td>{p.photo ? <img src={p.photo} alt="" className="w-9 h-9 rounded-full object-cover border border-white/10"/> : <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/20 text-xs border border-white/10"><FaUsers/></div>}</td>
                            <td><div className="font-semibold">{p.firstName} {p.lastName}{!p.isRead && <span className="mr-1 w-2 h-2 inline-block bg-yellow-500 rounded-full"/>}</div><div className="text-xs text-white/40">{p.phone}</div></td>
                            <td>{p.age}</td><td>{p.position}</td><td>{p.ageCategory}</td>
                            <td><span className={`px-2 py-1 rounded text-xs font-bold ${p.status==='accepted'?'badge-accepted':p.status==='rejected'?'badge-rejected':'badge-pending'}`}>{p.status==='accepted'?'مقبول':p.status==='rejected'?'مرفوض':'انتظار'}</span></td>
                            <td><div className="flex items-center justify-center gap-1.5">
                              <button onClick={()=>{markAsRead(p._id);alert(`${p.firstName} ${p.lastName}\nالعمر: ${p.age}\nالهاتف: ${p.phone}\nالإيميل: ${p.email}\nالولاية: ${p.wilaya}\nالبلدية: ${p.commune||'غير محدد'}\nالمركز: ${p.position}\nالقدم: ${p.preferredFoot}\n${p.message?'\nرسالة: '+p.message:''}`)}} className="icon-btn text-blue-400 hover:bg-blue-500/20" title="عرض"><FaEye/></button>
                              {p.status!=='accepted'&&<button onClick={()=>handleStatusChange(p._id,'accepted')} className="icon-btn text-green-400 hover:bg-green-500/20" title="قبول"><FaCheckCircle/></button>}
                              {p.status!=='rejected'&&<button onClick={()=>handleStatusChange(p._id,'rejected')} className="icon-btn text-orange-400 hover:bg-orange-500/20" title="رفض"><FaTimesCircle/></button>}
                              <button onClick={()=>handleDeletePlayer(p._id)} className="icon-btn text-red-400 hover:bg-red-500/20" title="حذف"><FaTrash/></button>
                            </div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======== TAB: STATS ======== */}
            {activeTab === 'stats' && (
              <div>
                <h2 className="text-xl font-bold gold-text mb-6 flex items-center gap-2"><FaChartBar/> الإحصائيات الكاملة</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  <StatBox title="إجمالي الطلبات" value={stats.total} icon={<FaUsers/>} color="text-blue-400"/>
                  <StatBox title="طلبات جديدة" value={stats.newRequests} icon={<FaClock/>} color="text-yellow-400"/>
                  <StatBox title="مقبولين" value={stats.accepted} icon={<FaCheckCircle/>} color="text-green-400"/>
                  <StatBox title="مرفوضين" value={stats.rejected} icon={<FaTimesCircle/>} color="text-red-400"/>
                  <StatBox title="قيد الانتظار" value={stats.pending} icon={<FaClock/>} color="text-orange-400"/>
                  <StatBox title="الأخبار" value={newsList.length} icon={<FaNewspaper/>} color="text-purple-400"/>
                  <StatBox title="المباريات" value={matchesList.length} icon={<FaFutbol/>} color="text-indigo-400"/>
                  <StatBox title="صور المعرض" value={galleryItems.length} icon={<FaImages/>} color="text-pink-400"/>
                </div>
                {/* Progress bars */}
                <div className="glass-card gold-border p-6">
                  <h3 className="font-bold text-white mb-4">توزيع الطلبات</h3>
                  {stats.total > 0 && ['accepted','rejected','pending'].map(s => {
                    const val = stats[s] || 0;
                    const pct = Math.round((val/stats.total)*100);
                    const colors = { accepted:'bg-green-500', rejected:'bg-red-500', pending:'bg-yellow-500' };
                    const labels = { accepted:'مقبول', rejected:'مرفوض', pending:'انتظار' };
                    return (
                      <div key={s} className="mb-3">
                        <div className="flex justify-between text-sm text-white/70 mb-1"><span>{labels[s]}</span><span>{val} ({pct}%)</span></div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${colors[s]} rounded-full transition-all duration-1000`} style={{width:`${pct}%`}}/>
                        </div>
                      </div>
                    );
                  })}
                  {stats.total === 0 && <p className="text-white/40 text-center py-4">لا توجد طلبات بعد</p>}
                </div>
              </div>
            )}

            {/* ======== TAB: NEWS ======== */}
            {activeTab === 'news' && (
              <div>
                <h2 className="text-xl font-bold gold-text mb-4 flex items-center gap-2"><FaNewspaper/> إدارة الأخبار</h2>
                <div className="glass-card gold-border p-5 mb-6">
                  <h3 className="font-bold text-white mb-4">{editingNews ? '✏️ تعديل الخبر' : '➕ إضافة خبر جديد'}</h3>
                  <form onSubmit={submitNews} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="عنوان الخبر" value={newsForm.title} onChange={e=>setNewsForm({...newsForm,title:e.target.value})} required placeholder="أدخل عنوان الخبر..." />
                    <div>
                      <label className="block text-white/70 text-sm font-bold mb-1">الفئة</label>
                      <select className="input-field" value={newsForm.category} onChange={e=>setNewsForm({...newsForm,category:e.target.value})}>
                        {['عام','مباريات','تدريبات','انتقالات','أخرى'].map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-white/70 text-sm font-bold mb-1">محتوى الخبر</label>
                      <textarea className="input-field min-h-[120px] resize-none" value={newsForm.content} onChange={e=>setNewsForm({...newsForm,content:e.target.value})} required placeholder="اكتب تفاصيل الخبر هنا..." />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-bold mb-1">صورة الخبر (اختياري)</label>
                      <input type="file" accept="image/*" ref={newsFileRef} onChange={e=>setNewsImage(e.target.files[0])}
                        className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 file:cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-10 h-5 rounded-full transition-colors ${newsForm.isPublished?'bg-green-500':'bg-white/20'} relative`} onClick={()=>setNewsForm({...newsForm,isPublished:!newsForm.isPublished})}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${newsForm.isPublished?'right-0.5':'left-0.5'}`}/>
                        </div>
                        <span className="text-white/70 text-sm">{newsForm.isPublished?'منشور':'مخفي'}</span>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                      <button type="submit" className="btn-gold flex-1 flex items-center justify-center gap-2"><FaSave/> {editingNews?'حفظ التعديلات':'نشر الخبر'}</button>
                      {editingNews && <button type="button" onClick={()=>{setEditingNews(null);setNewsForm({title:'',content:'',category:'عام',isPublished:true});setNewsImage(null);}} className="btn-outline flex-1 justify-center">إلغاء</button>}
                    </div>
                  </form>
                </div>
                <div className="space-y-3">
                  {newsList.length === 0 ? <div className="glass-card p-8 text-center text-white/40">لا توجد أخبار بعد</div>
                  : newsList.map(n => (
                    <div key={n._id} className="glass-card border border-white/5 p-4 flex items-center gap-4">
                      {n.image && <img src={n.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0"/>}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{n.title}</h4>
                        <p className="text-xs text-white/40">{n.category} · {new Date(n.createdAt).toLocaleDateString('ar')}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold shrink-0 ${n.isPublished?'bg-green-500/20 text-green-400':'bg-white/10 text-white/40'}`}>{n.isPublished?'منشور':'مخفي'}</span>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={()=>togglePublish(n._id)} className="icon-btn text-blue-400 hover:bg-blue-500/20">{n.isPublished?<FaEyeSlash/>:<FaEye/>}</button>
                        <button onClick={()=>editNews(n)} className="icon-btn text-yellow-400 hover:bg-yellow-500/20"><FaEdit/></button>
                        <button onClick={()=>deleteNews(n._id)} className="icon-btn text-red-400 hover:bg-red-500/20"><FaTrash/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======== TAB: MATCHES ======== */}
            {activeTab === 'matches' && (
              <div>
                <h2 className="text-xl font-bold gold-text mb-4 flex items-center gap-2"><FaFutbol/> إدارة المباريات</h2>
                <div className="glass-card gold-border p-5 mb-6">
                  <h3 className="font-bold text-white mb-4">{editingMatch?'✏️ تعديل مباراة':'➕ إضافة مباراة'}</h3>
                  <form onSubmit={submitMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="الفريق المضيف" value={matchForm.homeTeam} onChange={e=>setMatchForm({...matchForm,homeTeam:e.target.value})} required />
                    <InputField label="الفريق الضيف" value={matchForm.awayTeam} onChange={e=>setMatchForm({...matchForm,awayTeam:e.target.value})} required placeholder="اسم الفريق المنافس" />
                    <InputField label="تاريخ المباراة" type="date" value={matchForm.date} onChange={e=>setMatchForm({...matchForm,date:e.target.value})} required />
                    <InputField label="الملعب" value={matchForm.venue} onChange={e=>setMatchForm({...matchForm,venue:e.target.value})} placeholder="ملعب الخروب..." />
                    <InputField label="البطولة / المسابقة" value={matchForm.competition} onChange={e=>setMatchForm({...matchForm,competition:e.target.value})} placeholder="الدوري المحلي..." />
                    <div>
                      <label className="block text-white/70 text-sm font-bold mb-1">الحالة</label>
                      <select className="input-field" value={matchForm.status} onChange={e=>setMatchForm({...matchForm,status:e.target.value})}>
                        <option value="upcoming">قادمة</option>
                        <option value="completed">منتهية</option>
                        <option value="live">مباشرة</option>
                        <option value="cancelled">ملغاة</option>
                      </select>
                    </div>
                    {(matchForm.status==='completed'||matchForm.status==='live') && <>
                      <InputField label="نتيجة الفريق المضيف" type="number" value={matchForm.homeScore} onChange={e=>setMatchForm({...matchForm,homeScore:e.target.value})} placeholder="0" />
                      <InputField label="نتيجة الفريق الضيف" type="number" value={matchForm.awayScore} onChange={e=>setMatchForm({...matchForm,awayScore:e.target.value})} placeholder="0" />
                    </>}
                    <div className="md:col-span-2 flex gap-3">
                      <button type="submit" className="btn-gold flex-1 flex items-center justify-center gap-2"><FaSave/>{editingMatch?'حفظ التعديلات':'إضافة المباراة'}</button>
                      {editingMatch && <button type="button" onClick={()=>{setEditingMatch(null);setMatchForm({homeTeam:'JMK شباب مزاب الخروب',awayTeam:'',date:'',venue:'',competition:'',status:'upcoming',homeScore:'',awayScore:''});}} className="btn-outline flex-1 justify-center">إلغاء</button>}
                    </div>
                  </form>
                </div>
                <div className="space-y-3">
                  {matchesList.length===0?<div className="glass-card p-8 text-center text-white/40">لا توجد مباريات بعد</div>
                  :matchesList.map(m=>(
                    <div key={m._id} className="glass-card border border-white/5 p-4 flex items-center gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white">{m.homeTeam} <span className="text-yellow-400">vs</span> {m.awayTeam}</div>
                        {m.homeScore!=null && m.awayScore!=null && <div className="text-yellow-400 font-black text-lg">{m.homeScore} - {m.awayScore}</div>}
                        <div className="text-xs text-white/40">{m.venue || 'غير محدد'} · {m.date ? new Date(m.date).toLocaleDateString('ar') : ''}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.status==='completed'?'bg-green-500/20 text-green-400':m.status==='live'?'bg-red-500/20 text-red-400':'bg-blue-500/20 text-blue-400'}`}>
                        {m.status==='upcoming'?'قادمة':m.status==='completed'?'منتهية':m.status==='live'?'مباشرة 🔴':'ملغاة'}
                      </span>
                      <div className="flex gap-1.5">
                        <button onClick={()=>editMatch(m)} className="icon-btn text-yellow-400 hover:bg-yellow-500/20"><FaEdit/></button>
                        <button onClick={()=>deleteMatch(m._id)} className="icon-btn text-red-400 hover:bg-red-500/20"><FaTrash/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======== TAB: GALLERY ======== */}
            {activeTab === 'gallery' && (
              <div>
                <h2 className="text-xl font-bold gold-text mb-4 flex items-center gap-2"><FaImages/> إدارة المعرض</h2>
                <div className="glass-card gold-border p-5 mb-6">
                  <form onSubmit={uploadGallery} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1"><label className="block text-white/70 text-sm font-bold mb-1">عنوان الصورة</label><input type="text" className="input-field" placeholder="مثال: احتفال الفوز..." value={galleryTitle} onChange={e=>setGalleryTitle(e.target.value)} required /></div>
                    <div className="flex-1"><label className="block text-white/70 text-sm font-bold mb-1">الصورة (JPG, PNG)</label><input type="file" accept="image/*" ref={galleryFileRef} onChange={e=>setGalleryFile(e.target.files[0])} className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 file:cursor-pointer" required /></div>
                    <button type="submit" disabled={uploadingImg} className="btn-gold h-10 px-6 flex items-center gap-2 shrink-0">{uploadingImg?<div className="spinner w-4 h-4 border-2"/>:<><FaCloudUploadAlt/> رفع</>}</button>
                  </form>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {galleryItems.length===0?<div className="col-span-5 glass-card p-8 text-center text-white/40">لا توجد صور</div>
                  :galleryItems.map(item=>(
                    <div key={item._id} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <p className="text-white text-xs font-bold truncate mb-1">{item.title}</p>
                        <button onClick={()=>deleteGallery(item._id)} className="w-full bg-red-500 text-white py-1 rounded text-xs flex items-center justify-center gap-1"><FaTrash/> حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======== TAB: ABOUT ======== */}
            {activeTab === 'about' && (
              <div>
                <h2 className="text-xl font-bold gold-text mb-4 flex items-center gap-2"><FaInfoCircle/> معلومات النادي</h2>
                <div className="glass-card gold-border p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {[
                      ['name','اسم الفريق'],['fullName','الاسم الكامل (بالفرنسية)'],
                      ['founded','سنة التأسيس'],['city','المدينة'],
                      ['country','الدولة'],['colors','الألوان الرسمية'],
                      ['stadium','الملعب'],['email','البريد الإلكتروني']
                    ].map(([key,label])=>(
                      <div key={key}>
                        <label className="block text-white/70 text-sm font-bold mb-1">{label}</label>
                        <input type="text" className="input-field" value={aboutData[key]||''} onChange={e=>setAboutData({...aboutData,[key]:e.target.value})} />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-white/70 text-sm font-bold mb-1">وصف النادي</label>
                      <textarea className="input-field min-h-[100px] resize-none" value={aboutData.description||''} onChange={e=>setAboutData({...aboutData,description:e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-white/70 text-sm font-bold mb-1">رؤية النادي</label>
                      <textarea className="input-field min-h-[80px] resize-none" value={aboutData.vision||''} onChange={e=>setAboutData({...aboutData,vision:e.target.value})} />
                    </div>
                  </div>
                  <button onClick={saveAbout} disabled={savingAbout} className="btn-gold flex items-center gap-2"><FaSave/>{savingAbout?'جاري الحفظ...':'حفظ معلومات النادي'}</button>
                </div>
              </div>
            )}

            {/* ======== TAB: CONTACT ======== */}
            {activeTab === 'contact' && (
              <div>
                <h2 className="text-xl font-bold gold-text mb-4 flex items-center gap-2"><FaPhone/> معلومات التواصل</h2>
                <div className="glass-card gold-border p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {[
                      ['phone','رقم الهاتف'],['email','البريد الإلكتروني'],
                      ['address','العنوان'],['facebook','رابط فيسبوك'],
                      ['whatsapp','رقم واتساب (بدون +)'],['instagram','رابط انستغرام'],
                      ['youtube','رابط يوتيوب'],
                    ].map(([key,label])=>(
                      <div key={key}>
                        <label className="block text-white/70 text-sm font-bold mb-1">{label}</label>
                        <input type="text" className="input-field" value={contactData[key]||''} onChange={e=>setContactData({...contactData,[key]:e.target.value})} />
                      </div>
                    ))}
                  </div>
                  <button onClick={saveContact} disabled={savingContact} className="btn-gold flex items-center gap-2"><FaSave/>{savingContact?'جاري الحفظ...':'حفظ معلومات التواصل'}</button>
                </div>
              </div>
            )}

            {/* ======== TAB: FORM FIELDS ======== */}
            {activeTab === 'form-fields' && (
              <div>
                <h2 className="text-xl font-bold gold-text mb-4 flex items-center gap-2"><FaEdit/> بناء الاستمارة</h2>
                <div className="glass-card gold-border p-5 mb-4 text-sm text-yellow-400/80">💡 يمكنك تفعيل أو إيقاف الحقول وتغيير ما هو إلزامي. لا يمكن إيقاف حقلَي الاسم والعمر.</div>
                <div className="space-y-3">
                  {formFields.map(f=>(
                    <div key={f.id} className="glass-card border border-white/5 p-4 flex items-center gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{f.label}</h4>
                        <p className="text-xs text-white/40">نوع: {f.type} · ID: {f.id}</p>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-xs text-white/60">مفعّل</span>
                          <div className={`w-9 h-5 rounded-full transition-colors ${f.enabled?'bg-yellow-500':'bg-white/20'} relative cursor-pointer`} onClick={()=>!['firstName','age'].includes(f.id)&&toggleField(f.id)}>
                            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all ${f.enabled?'right-0.5':'left-0.5'}`}/>
                          </div>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-xs text-white/60">إلزامي</span>
                          <div className={`w-9 h-5 rounded-full transition-colors ${f.required?'bg-red-500':'bg-white/20'} relative cursor-pointer`} onClick={()=>toggleRequired(f.id)}>
                            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all ${f.required?'right-0.5':'left-0.5'}`}/>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button onClick={saveFields} disabled={savingFields} className="btn-gold flex items-center gap-2"><FaSave/>{savingFields?'جاري الحفظ...':'حفظ إعدادات الاستمارة'}</button>
                </div>
              </div>
            )}

            {/* ======== TAB: APPEARANCE ======== */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-bold gold-text mb-4 flex items-center gap-2"><FaPalette/> المظهر والألوان</h2>
                <div className="glass-card gold-border p-6">
                  <p className="text-white/50 text-sm mb-6">التغييرات تُطبَّق فوراً على الموقع. استخدم "استعادة الافتراضي" للرجوع.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-6">
                    {[
                      ['goldColor','اللون الذهبي (Gold)'],
                      ['bgColor','خلفية رئيسية'],
                      ['bg2Color','خلفية ثانوية'],
                      ['textColor','لون النصوص'],
                      ['accentGreen','لون القبول (أخضر)'],
                      ['accentRed','لون الرفض (أحمر)'],
                    ].map(([key,label])=>(
                      <div key={key} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <input type="color" value={appearance[key]||'#000000'} onChange={e=>setAppearance({...appearance,[key]:e.target.value})}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                        <div>
                          <p className="text-white font-semibold text-sm">{label}</p>
                          <p className="text-white/40 text-xs font-mono">{appearance[key]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={saveAppearance} disabled={savingAppearance} className="btn-gold flex items-center gap-2"><FaPalette/>{savingAppearance?'جاري التطبيق...':'تطبيق الألوان'}</button>
                    <button onClick={resetAppearance} className="btn-outline flex items-center gap-2">↩ استعادة الافتراضي</button>
                  </div>
                  <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-white font-bold mb-3">معاينة الألوان</h4>
                    <div className="flex gap-3 flex-wrap">
                      {Object.entries(appearance).map(([k,v])=>(
                        <div key={k} className="text-center">
                          <div className="w-12 h-12 rounded-xl mb-1 border border-white/20" style={{backgroundColor:v}}/>
                          <p className="text-white/40 text-xs">{k.replace('Color','').replace('accent','')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======== TAB: SECURITY ======== */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold gold-text mb-4 flex items-center gap-2"><FaLock/> الأمان</h2>
                <div className="glass-card gold-border p-6 max-w-lg">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FaKey/> تغيير كلمة مرور الإدارة 🔑</h3>
                  <form onSubmit={changePassword} className="space-y-4">
                    {[
                      ['current','كلمة المرور الحالية','passwords.current'],
                      ['newPass','كلمة المرور الجديدة','passwords.newPass'],
                      ['confirm','تأكيد كلمة المرور الجديدة','passwords.confirm'],
                    ].map(([key,label])=>(
                      <div key={key}>
                        <label className="block text-white/70 text-sm font-bold mb-1">{label}</label>
                        <input type="password" className="input-field" placeholder="••••••••" value={passwords[key]} onChange={e=>setPasswords({...passwords,[key]:e.target.value})} required />
                      </div>
                    ))}
                    <button type="submit" disabled={changingPass} className="btn-gold w-full flex items-center justify-center gap-2">
                      {changingPass?<div className="spinner w-5 h-5 border-2"/>:<><FaLock/> تغيير كلمة المرور</>}
                    </button>
                  </form>
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-400/80">
                    <FaShieldAlt className="inline mr-1"/> كلمة المرور الحالية محفوظة في البيئة الافتراضية: <code className="bg-black/30 px-1 rounded">admin123</code>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;

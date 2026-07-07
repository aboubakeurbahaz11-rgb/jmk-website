import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFutbol, FaImage, FaPaperPlane, FaLock, FaFacebook } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '../utils/api';

const WILAYAS = [
  'أدرار','الشلف','الأغواط','أم البواقي','باتنة','بجاية','بسكرة','بشار','البليدة','البويرة',
  'تمنراست','تبسة','تلمسان','تيارت','تيزي وزو','الجزائر','الجلفة','جيجل','سطيف','سعيدة',
  'سكيكدة','سيدي بلعباس','عنابة','قالمة','قسنطينة','المدية','مستغانم','المسيلة','معسكر',
  'ورقلة','وهران','البيض','إليزي','برج بوعريريج','بومرداس','الطارف','تندوف','تيسمسيلت',
  'الوادي','خنشلة','سوق أهراس','تيبازة','ميلة','عين الدفلى','النعامة','عين تموشنت',
  'غرداية','غليزان','تيميمون','برج باجي مختار','أولاد جلال','بني عباس','عين صالح',
  'عين قزام','توقرت','جانت','المغير','المنيعة'
];

const POSITIONS = ['حارس مرمى', 'مدافع', 'وسط ميدان', 'مهاجم'];
const AGE_CATEGORIES = ['U10', 'U12', 'U14', 'U16', 'U18', 'U21', 'Seniors', 'Vétérans'];
const FEET = ['اليمنى', 'اليسرى', 'كلاهما'];

const FormField = ({ label, icon, error, children }) => (
  <div>
    <label className="block text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
      <span className="text-yellow-500">{icon}</span>
      {label}
    </label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const Register = () => {
  const [registrationOpen, setRegistrationOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: '', lastName: '', age: '', phone: '', email: '',
    wilaya: '', commune: '', position: '', ageCategory: '', preferredFoot: '',
    message: '', photo: null
  });

  useEffect(() => {
    API.get('/settings/registration')
      .then(res => setRegistrationOpen(res.data.registrationOpen))
      .catch(() => setRegistrationOpen(true));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files[0]) {
      setForm(p => ({ ...p, photo: files[0] }));
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(p => ({ ...p, [name]: value }));
      if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'الاسم مطلوب';
    if (!form.lastName.trim()) e.lastName = 'اللقب مطلوب';
    if (!form.age || form.age < 5 || form.age > 60) e.age = 'العمر يجب أن يكون بين 5 و 60';
    if (!form.phone.trim()) e.phone = 'رقم الهاتف مطلوب';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'بريد إلكتروني صحيح مطلوب';
    if (!form.wilaya) e.wilaya = 'الولاية مطلوبة';
    if (!form.position) e.position = 'المركز مطلوب';
    if (!form.ageCategory) e.ageCategory = 'الفئة العمرية مطلوبة';
    if (!form.preferredFoot) e.preferredFoot = 'القدم المفضلة مطلوبة';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Show message if server takes time to wake up (Render free tier)
    const wakeupTimer = setTimeout(() => {
      toast.loading('⏳ الخادم يستيقظ، انتظر قليلاً...', { id: 'wakeup' });
    }, 5000);
    try {
      let payload;
      let config = {};

      if (form.photo) {
        payload = new FormData();
        Object.entries(form).forEach(([k, v]) => {
          if (v !== null && v !== undefined && v !== '') {
            payload.append(k, v);
          }
        });
      } else {
        payload = { ...form };
        delete payload.photo;
        config = { headers: { 'Content-Type': 'application/json' } };
      }

      await API.post('/players', payload, config);
      clearTimeout(wakeupTimer);
      toast.dismiss('wakeup');
      toast.success('✅ تم إرسال طلبك بنجاح! سيتم مراجعته قريباً.', { duration: 5000 });
      setForm({ firstName: '', lastName: '', age: '', phone: '', email: '', wilaya: '', commune: '', position: '', ageCategory: '', preferredFoot: '', message: '', photo: null });
      setPhotoPreview(null);
    } catch (err) {
      clearTimeout(wakeupTimer);
      toast.dismiss('wakeup');
      console.error('Registration error:', err.response || err);
      const msg = err.response?.data?.message || 'حدث خطأ أثناء الإرسال. يرجى المحاولة مجدداً.';
      toast.error(msg, { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  if (registrationOpen === null) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="spinner" />
      </div>
    );
  }

  if (!registrationOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-card gold-border p-10 text-center max-w-lg w-full"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaLock className="text-yellow-500 text-6xl mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-black gold-text mb-4">🔒 التسجيلات مغلقة حالياً</h2>
          <p className="text-white/70 leading-relaxed text-lg mb-6">
            شكراً لاهتمامكم بالانضمام إلى فريق JMK شباب مزاب الخروب ❤️
            <br /><br />
            تابعوا الصفحة لمعرفة موعد التسجيل القادم.
          </p>
          <a
            href="https://www.facebook.com/share/1CySPaU5QY/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 px-6 py-3 rounded-full font-semibold hover:bg-blue-600/40 transition-all"
          >
            <FaFacebook />
            تابعنا على فيسبوك
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <img src="/logo.png" alt="JMK" className="w-20 h-20 object-contain rounded-full mx-auto mb-4 border-2 border-yellow-500/30"
            onError={(e) => { e.target.style.display='none'; }} />
          <h1 className="text-4xl font-black gold-text mb-2">استمارة الانضمام</h1>
          <p className="text-white/50">انضم إلى عائلة JMK شباب مزاب الخروب</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-card gold-border p-6 md:p-10 space-y-6"
        >
          {/* Row 1: Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="الاسم" icon={<FaUser size={12} />} error={errors.firstName}>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="أدخل اسمك" className={`form-input ${errors.firstName ? 'border-red-500' : ''}`} />
            </FormField>
            <FormField label="اللقب" icon={<FaUser size={12} />} error={errors.lastName}>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="أدخل لقبك" className={`form-input ${errors.lastName ? 'border-red-500' : ''}`} />
            </FormField>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="العمر" icon={<FaUser size={12} />} error={errors.age}>
              <input name="age" type="number" min="5" max="60" value={form.age} onChange={handleChange} placeholder="عمرك" className={`form-input ${errors.age ? 'border-red-500' : ''}`} />
            </FormField>
            <FormField label="رقم الهاتف" icon={<FaPhone size={12} />} error={errors.phone}>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+213 7XX XXX XXX" className={`form-input ${errors.phone ? 'border-red-500' : ''}`} dir="ltr" />
            </FormField>
          </div>

          {/* Email */}
          <FormField label="البريد الإلكتروني" icon={<FaEnvelope size={12} />} error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" className={`form-input ${errors.email ? 'border-red-500' : ''}`} dir="ltr" />
          </FormField>

          {/* Wilaya + Commune */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="الولاية" icon={<FaMapMarkerAlt size={12} />} error={errors.wilaya}>
              <select name="wilaya" value={form.wilaya} onChange={handleChange} className={`form-input ${errors.wilaya ? 'border-red-500' : ''}`}>
                <option value="">اختر الولاية</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </FormField>
            <FormField label="البلدية" icon={<FaMapMarkerAlt size={12} />} error={errors.commune}>
              <input name="commune" value={form.commune} onChange={handleChange} placeholder="أدخل اسم بلديتك" className={`form-input ${errors.commune ? 'border-red-500' : ''}`} />
            </FormField>
          </div>

          {/* Row 3: Position & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="المركز" icon={<FaFutbol size={12} />} error={errors.position}>
              <select name="position" value={form.position} onChange={handleChange} className={`form-input ${errors.position ? 'border-red-500' : ''}`}>
                <option value="">اختر المركز</option>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="الفئة العمرية" icon={<FaUser size={12} />} error={errors.ageCategory}>
              <select name="ageCategory" value={form.ageCategory} onChange={handleChange} className={`form-input ${errors.ageCategory ? 'border-red-500' : ''}`}>
                <option value="">اختر الفئة</option>
                {AGE_CATEGORIES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </FormField>
          </div>

          {/* Preferred Foot */}
          <FormField label="القدم المفضلة" icon={<FaFutbol size={12} />} error={errors.preferredFoot}>
            <div className="flex gap-3">
              {FEET.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => { setForm(p => ({ ...p, preferredFoot: f })); setErrors(p => ({ ...p, preferredFoot: '' })); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border
                    ${form.preferredFoot === f
                      ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-yellow-500/40'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {errors.preferredFoot && <p className="text-red-400 text-xs mt-1">{errors.preferredFoot}</p>}
          </FormField>

          {/* Photo Upload */}
          <FormField label="صورة شخصية (اختياري)" icon={<FaImage size={12} />}>
            <div className="flex items-center gap-4">
              {photoPreview && (
                <img src={photoPreview} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/40" />
              )}
              <label className="flex-1 cursor-pointer">
                <div className={`form-input flex items-center gap-3 cursor-pointer hover:border-yellow-500/50 transition-colors ${photoPreview ? 'border-yellow-500/40' : ''}`}>
                  <FaImage className="text-yellow-500/50" />
                  <span className="text-white/40 text-sm">{form.photo ? form.photo.name : 'اختر صورة (JPG, PNG)'}</span>
                </div>
                <input name="photo" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleChange} className="hidden" />
              </label>
            </div>
          </FormField>

          {/* Message */}
          <FormField label="رسالة قصيرة (اختياري)" icon={<FaPaperPlane size={12} />}>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="اكتب شيئاً عن نفسك وخبرتك الكروية..."
              rows={4}
              className="form-input resize-none"
              maxLength={500}
            />
            <p className="text-white/30 text-xs text-left mt-1">{form.message.length}/500</p>
          </FormField>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="btn-gold w-full text-lg py-4 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />جاري الإرسال...</>
            ) : (
              <><FaPaperPlane />إرسال الطلب</>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default Register;

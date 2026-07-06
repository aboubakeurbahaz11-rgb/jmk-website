const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

// Helper to get or create a setting
const getSetting = async (key, defaultValue) => {
  let setting = await Setting.findOne({ key });
  if (!setting) {
    setting = await new Setting({ key, value: defaultValue }).save();
  }
  return setting.value;
};

const setSetting = async (key, value) => {
  return Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
};

// ==================== REGISTRATION ====================
router.get('/registration', async (req, res) => {
  try {
    const value = await getSetting('registrationOpen', true);
    res.json({ registrationOpen: value });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

router.patch('/registration', auth, async (req, res) => {
  try {
    const { value } = req.body;
    await setSetting('registrationOpen', value);
    res.json({ message: `التسجيل ${value ? 'مفتوح' : 'مغلق'} الآن` });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// ==================== ABOUT ====================
const defaultAbout = {
  name: 'JMK - شباب مزاب الخروب',
  fullName: 'Jeunesse Mzab El Khroub',
  founded: '2015',
  city: 'الخروب، قسنطينة',
  country: 'الجزائر',
  description: 'فريق كرة قدم جزائري يمثل منطقة مزاب في مدينة الخروب، ولاية قسنطينة. يسعى الفريق إلى تطوير المواهب الكروية المحلية وتنمية روح الانتماء والفخر بالهوية الجزائرية.',
  vision: 'بناء جيل رياضي متميز يمثل المنطقة بكفاءة واحترافية على المستويين المحلي والوطني.',
  colors: 'الأسود والذهبي',
  stadium: 'ملعب الخروب',
  email: 'Jeunessemzabeelkhroub25@gmail.com',
  phone: '+213 773 17 12 83',
  facebook: 'https://www.facebook.com/share/1CySPaU5QY/',
  whatsapp: '+213773171283',
  achievements: [
    { label: 'لاعبين مسجلين', value: '50+' },
    { label: 'سنوات الخبرة', value: '9+' },
    { label: 'مباريات لعبناها', value: '100+' },
    { label: 'فئات عمرية', value: '3' }
  ]
};

router.get('/about', async (req, res) => {
  try {
    const value = await getSetting('about', defaultAbout);
    res.json(value);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

router.put('/about', auth, async (req, res) => {
  try {
    await setSetting('about', req.body);
    res.json({ message: 'تم حفظ معلومات النادي بنجاح', data: req.body });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// ==================== CONTACT ====================
const defaultContact = {
  phone: '+213 773 17 12 83',
  email: 'Jeunessemzabeelkhroub25@gmail.com',
  address: 'الخروب، قسنطينة، الجزائر',
  facebook: 'https://www.facebook.com/share/1CySPaU5QY/',
  whatsapp: '+213773171283',
  instagram: '',
  youtube: ''
};

router.get('/contact', async (req, res) => {
  try {
    const value = await getSetting('contact', defaultContact);
    res.json(value);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

router.put('/contact', auth, async (req, res) => {
  try {
    await setSetting('contact', req.body);
    res.json({ message: 'تم حفظ معلومات التواصل بنجاح', data: req.body });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// ==================== APPEARANCE ====================
const defaultAppearance = {
  goldColor: '#f5c518',
  bgColor: '#0a0a0a',
  bg2Color: '#141414',
  textColor: '#f6f4ee',
  accentGreen: '#1e6b3e',
  accentRed: '#b3413a'
};

router.get('/appearance', async (req, res) => {
  try {
    const value = await getSetting('appearance', defaultAppearance);
    res.json(value);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

router.put('/appearance', auth, async (req, res) => {
  try {
    await setSetting('appearance', req.body);
    res.json({ message: 'تم تطبيق المظهر الجديد بنجاح', data: req.body });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// ==================== FORM FIELDS ====================
const defaultFormFields = [
  { id: 'firstName', label: 'الاسم', type: 'text', required: true, enabled: true },
  { id: 'lastName', label: 'اللقب', type: 'text', required: true, enabled: true },
  { id: 'age', label: 'العمر', type: 'number', required: true, enabled: true },
  { id: 'phone', label: 'رقم الهاتف', type: 'text', required: true, enabled: true },
  { id: 'email', label: 'البريد الإلكتروني', type: 'email', required: false, enabled: true },
  { id: 'wilaya', label: 'الولاية', type: 'select', required: false, enabled: true },
  { id: 'ageCategory', label: 'الفئة العمرية', type: 'select', required: true, enabled: true },
  { id: 'position', label: 'المركز', type: 'select', required: true, enabled: true },
  { id: 'preferredFoot', label: 'القدم المفضلة', type: 'radio', required: false, enabled: true },
  { id: 'photo', label: 'صورة شخصية', type: 'file', required: false, enabled: true },
  { id: 'message', label: 'رسالة قصيرة', type: 'textarea', required: false, enabled: true }
];

router.get('/form-fields', async (req, res) => {
  try {
    const value = await getSetting('formFields', defaultFormFields);
    res.json(value);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

router.put('/form-fields', auth, async (req, res) => {
  try {
    await setSetting('formFields', req.body);
    res.json({ message: 'تم حفظ حقول الاستمارة بنجاح', data: req.body });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;

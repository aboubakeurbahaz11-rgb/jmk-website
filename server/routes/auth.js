const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }

    // Check stored admin credentials (allow override via Settings DB)
    let adminEmail = process.env.ADMIN_EMAIL;
    let adminPassword = process.env.ADMIN_PASSWORD;

    // Try to get custom credentials from DB
    const customCreds = await Setting.findOne({ key: 'adminCredentials' });
    if (customCreds) {
      adminEmail = customCreds.value.email || adminEmail;
      adminPassword = customCreds.value.password || adminPassword;
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: { email: adminEmail, role: 'admin' },
      message: 'تم تسجيل الدخول بنجاح'
    });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
});

// GET /api/auth/verify
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// POST /api/auth/change-password - Admin only
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'يرجى تعبئة جميع الحقول' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });
    }

    // Check current password
    let adminEmail = process.env.ADMIN_EMAIL;
    let adminPassword = process.env.ADMIN_PASSWORD;
    const customCreds = await Setting.findOne({ key: 'adminCredentials' });
    if (customCreds) {
      adminEmail = customCreds.value.email || adminEmail;
      adminPassword = customCreds.value.password || adminPassword;
    }

    if (currentPassword !== adminPassword) {
      return res.status(401).json({ message: 'كلمة المرور الحالية غير صحيحة' });
    }

    // Store new password in DB
    await Setting.findOneAndUpdate(
      { key: 'adminCredentials' },
      { value: { email: adminEmail, password: newPassword } },
      { upsert: true, new: true }
    );

    res.json({ message: 'تم تغيير كلمة المرور بنجاح ✅' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;

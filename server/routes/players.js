const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Player = require('../models/Player');
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

const { uploadMiddleware, deleteImage } = require('../config/cloudinary');
const upload = uploadMiddleware('players');

// Email transporter
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({ from: `"JMK فريق" <${process.env.EMAIL_USER}>`, to, subject, html });
    return true;
  } catch (err) {
    console.error('Email error:', err.message);
    return false;
  }
};

// POST /api/players - Submit registration
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const regSetting = await Setting.findOne({ key: 'registrationOpen' });
    if (regSetting && !regSetting.value) {
      return res.status(403).json({ message: 'التسجيلات مغلقة حالياً' });
    }
    const { firstName, lastName, age, phone, email, wilaya, commune, position, ageCategory, preferredFoot, message } = req.body;
    if (!firstName || !lastName || !age || !phone || !email || !wilaya || !position || !ageCategory || !preferredFoot) {
      return res.status(400).json({ message: 'جميع الحقول الإلزامية مطلوبة' });
    }
    const player = new Player({
      firstName, lastName, age: parseInt(age), phone, email, wilaya,
      commune: commune || '',
      position, ageCategory, preferredFoot,
      photo: req.file ? req.file.path : '',
      message: message || ''
    });
    await player.save();
    res.status(201).json({ message: 'تم إرسال طلبك بنجاح! سيتم مراجعته قريباً.', player });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
});

// GET /api/players - Get all players (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const players = await Player.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Player.countDocuments(filter);
    res.json({ players, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
});

// GET /api/players/stats - Stats
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Player.countDocuments();
    const accepted = await Player.countDocuments({ status: 'accepted' });
    const rejected = await Player.countDocuments({ status: 'rejected' });
    const pending = await Player.countDocuments({ status: 'pending' });
    const newRequests = await Player.countDocuments({ isRead: false });
    res.json({ total, accepted, rejected, pending, newRequests });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
});

// PATCH /api/players/:id/status - Accept or Reject
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'حالة غير صالحة' });
    }
    const player = await Player.findByIdAndUpdate(req.params.id, { status, isRead: true }, { new: true });
    if (!player) return res.status(404).json({ message: 'اللاعب غير موجود' });

    // Send notification email
    if (player.email) {
      if (status === 'accepted') {
        await sendEmail(
          player.email,
          '✅ تم قبول طلبك - JMK شباب مزاب الخروب',
          `<div dir="rtl" style="font-family:Arial;background:#0a0a0a;color:#fff;padding:30px;border-radius:10px;">
            <h2 style="color:#f5c518;">🏆 JMK - شباب مزاب الخروب</h2>
            <p>مرحباً <strong>${player.firstName} ${player.lastName}</strong>،</p>
            <p style="font-size:18px;">تم قبول طلب انضمامك إلى فريق JMK ❤️</p>
            <p>سيتم التواصل معك قريباً لمعرفة التفاصيل.</p>
            <p style="color:#f5c518;">مبروك ونتمنى لك التوفيق!</p>
            <hr style="border-color:#f5c518;"/>
            <small>JMK - Jeunesse Mzab El Khroub</small>
          </div>`
        );
      } else if (status === 'rejected') {
        await sendEmail(
          player.email,
          'JMK - إشعار بخصوص طلبك',
          `<div dir="rtl" style="font-family:Arial;background:#0a0a0a;color:#fff;padding:30px;border-radius:10px;">
            <h2 style="color:#f5c518;">🏆 JMK - شباب مزاب الخروب</h2>
            <p>مرحباً <strong>${player.firstName} ${player.lastName}</strong>،</p>
            <p>شكرا لاهتمامك بفريق JMK، لم يتم قبول الطلب حاليا.</p>
            <p>نتمنى لك التوفيق ونشجعك على المتابعة والمحاولة مرة أخرى.</p>
            <hr style="border-color:#f5c518;"/>
            <small>JMK - Jeunesse Mzab El Khroub</small>
          </div>`
        );
      }
    }
    res.json({ message: 'تم تحديث الحالة بنجاح', player });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
});

// PATCH /api/players/:id/read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    await Player.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ', error: err.message });
  }
});

// DELETE /api/players/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: 'اللاعب غير موجود' });
    if (player.photo) {
      await deleteImage(player.photo);
    }
    res.json({ message: 'تم الحذف بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
});

module.exports = router;

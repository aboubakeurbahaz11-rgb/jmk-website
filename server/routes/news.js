const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const News = require('../models/News');
const auth = require('../middleware/auth');

const { uploadMiddleware, deleteImage } = require('../config/cloudinary');
const upload = uploadMiddleware('news');

// GET /api/news - Public (published only)
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const filter = { isPublished: true };
    const news = await News.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await News.countDocuments(filter);
    res.json({ news, total });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// GET /api/news/all - Admin (all including unpublished)
router.get('/all', auth, async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json({ news });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// POST /api/news - Admin: Create
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, isPublished } = req.body;
    const news = new News({
      title, content, category,
      isPublished: isPublished === 'true' || isPublished === true,
      image: req.file ? req.file.path : ''
    });
    await news.save();
    res.status(201).json({ message: 'تم إضافة الخبر', news });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// PUT /api/news/:id - Admin: Update
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, isPublished } = req.body;
    const update = {
      title, content, category,
      isPublished: isPublished === 'true' || isPublished === true
    };
    if (req.file) update.image = req.file.path;
    const news = await News.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!news) return res.status(404).json({ message: 'الخبر غير موجود' });
    res.json({ message: 'تم تحديث الخبر', news });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// PATCH /api/news/:id/publish - Admin: toggle publish
router.patch('/:id/publish', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'الخبر غير موجود' });
    news.isPublished = !news.isPublished;
    await news.save();
    res.json({ message: news.isPublished ? 'تم نشر الخبر' : 'تم إخفاء الخبر', news });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// DELETE /api/news/:id - Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news && news.image) {
      await deleteImage(news.image);
    }
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الخبر' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;

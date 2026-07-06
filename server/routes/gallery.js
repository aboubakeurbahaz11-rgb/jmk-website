const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

const { uploadMiddleware, deleteImage } = require('../config/cloudinary');
const upload = uploadMiddleware('gallery');

// GET /api/gallery - Public
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gallery' });
  }
});

// POST /api/gallery - Admin only
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'الصورة مطلوبة' });
    }
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'عنوان الصورة مطلوب' });
    }

    const newImage = new Gallery({
      title,
      imageUrl: req.file.path
    });

    await newImage.save();
    res.status(201).json({ message: 'تم رفع الصورة بنجاح', image: newImage });
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء رفع الصورة' });
  }
});

// DELETE /api/gallery/:id - Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'الصورة غير موجودة' });

    // Delete file
    if (image.imageUrl) {
      await deleteImage(image.imageUrl);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الصورة بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء حذف الصورة' });
  }
});

module.exports = router;

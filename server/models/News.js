const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  category: {
    type: String,
    enum: ['أخبار', 'نتائج', 'إعلانات', 'تقارير'],
    default: 'أخبار'
  },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);

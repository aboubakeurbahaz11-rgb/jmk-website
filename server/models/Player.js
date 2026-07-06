const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 5, max: 60 },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  wilaya: { type: String, required: true },
  commune: { type: String, default: '', trim: true },
  position: {
    type: String,
    required: true,
    enum: ['حارس مرمى', 'مدافع', 'وسط ميدان', 'مهاجم']
  },
  ageCategory: {
    type: String,
    required: true,
    enum: ['U10', 'U12', 'U14', 'U16', 'U18', 'U21', 'Seniors', 'Vétérans']
  },
  preferredFoot: {
    type: String,
    required: true,
    enum: ['اليمنى', 'اليسرى', 'كلاهما']
  },
  photo: { type: String, default: '' },
  message: { type: String, default: '', maxlength: 500 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);

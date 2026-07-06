const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  homeScore: { type: Number, default: null },
  awayScore: { type: Number, default: null },
  date: { type: Date, required: true },
  venue: { type: String, default: '' },
  competition: { type: String, default: 'Championnat' },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'finished'],
    default: 'upcoming'
  },
  category: { type: String, default: 'Seniors' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);

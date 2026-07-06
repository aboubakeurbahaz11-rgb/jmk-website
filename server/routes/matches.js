const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const auth = require('../middleware/auth');

// GET /api/matches - Public
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const matches = await Match.find(filter).sort({ date: -1 });
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// POST /api/matches - Admin: Create
router.post('/', auth, async (req, res) => {
  try {
    const { homeTeam, awayTeam, date, venue, competition, status, homeScore, awayScore } = req.body;
    const match = new Match({ homeTeam, awayTeam, date, venue, competition, status, homeScore, awayScore });
    await match.save();
    res.status(201).json({ message: 'تم إضافة المباراة', match });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// PUT /api/matches/:id - Admin: Update
router.put('/:id', auth, async (req, res) => {
  try {
    const { homeTeam, awayTeam, date, venue, competition, status, homeScore, awayScore } = req.body;
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { homeTeam, awayTeam, date, venue, competition, status, homeScore, awayScore },
      { new: true }
    );
    if (!match) return res.status(404).json({ message: 'المباراة غير موجودة' });
    res.json({ message: 'تم تحديث المباراة', match });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// DELETE /api/matches/:id - Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف المباراة' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;

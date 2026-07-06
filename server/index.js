require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/players', require('./routes/players'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/news', require('./routes/news'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/gallery', require('./routes/gallery'));


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'JMK Server is running' });
});

// Connect to MongoDB (with memory server fallback)
async function startServer() {
  let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jmk-website';

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB:', mongoUri);
  } catch (err) {
    console.warn('⚠️  Could not connect to MongoDB. Trying in-memory server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB in-memory server');
      console.log('ℹ️  Note: Data will NOT persist between server restarts (dev mode)');
    } catch (memErr) {
      console.error('❌ MongoDB connection failed:', memErr.message);
      console.error('Please install MongoDB or configure MONGODB_URI in server/.env');
    }
  }

  // Initialize default settings
  try {
    const Setting = require('./models/Setting');
    const existing = await Setting.findOne({ key: 'registrationOpen' });
    if (!existing) {
      await new Setting({ key: 'registrationOpen', value: true }).save();
      console.log('✅ Default settings initialized');
    }
  } catch (e) {}

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 JMK Server running on http://localhost:${PORT}`);
    console.log(`📋 Admin email: ${process.env.ADMIN_EMAIL}`);
    console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD}`);
  });
}

startServer();

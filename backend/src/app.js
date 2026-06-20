require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const analyticsRoutes = require('./routes/analytics');
const alertRoutes = require('./routes/alerts');
const fanRoutes = require('./routes/fans');
const seedDatabase = require('./models/seed');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/fans', fanRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5001;

sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ Database synced');
  await seedDatabase(require('./models'));
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('❌ DB sync failed:', err.message);
  console.log('⚠️  Starting without DB (mock mode)...');
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT} (no DB)`));
});

module.exports = app;

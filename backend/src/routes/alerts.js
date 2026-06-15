const express = require('express');
const { Alert } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/alerts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.findAll({ order: [['created_at', 'DESC']], limit: 50 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/alerts (admin/manager only)
router.post('/', authMiddleware, roleMiddleware('manager', 'admin'), async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/alerts/:id/resolve
router.patch('/:id/resolve', authMiddleware, roleMiddleware('manager', 'admin'), async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    await alert.update({ resolved: true });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

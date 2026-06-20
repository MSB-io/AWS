const express = require('express');
const { sequelize, User, Event, EngagementRecord } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { fn, col, literal } = require('sequelize');
const router = express.Router();

// GET /api/analytics/summary
router.get('/summary', authMiddleware, roleMiddleware('manager', 'admin'), async (req, res) => {
  try {
    const totalFans = await User.count({ where: { role: 'fan' } });
    const totalEvents = await Event.count();
    const liveEvents = await Event.count({ where: { status: 'live' } });
    const totalEngagements = await EngagementRecord.count();
    const totalTicketsSold = await Event.sum('tickets_sold') || 0;
    const totalRevenue = await Event.sum(literal('tickets_sold * ticket_price')) || 0;

    res.json({
      totalFans,
      totalEvents,
      liveEvents,
      totalEngagements,
      totalTicketsSold,
      totalRevenue: parseFloat(totalRevenue).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/engagement - monthly engagement trend
router.get('/engagement', authMiddleware, roleMiddleware('manager', 'admin'), async (req, res) => {
  try {
    const isSqlite = sequelize.options.dialect === 'sqlite';
    const monthAttr = isSqlite ? fn('strftime', '%m', col('created_at')) : fn('MONTH', col('created_at'));
    const yearAttr = isSqlite ? fn('strftime', '%Y', col('created_at')) : fn('YEAR', col('created_at'));

    // Return last 6 months of engagement grouped by month
    const data = await EngagementRecord.findAll({
      attributes: [
        [monthAttr, 'month'],
        [yearAttr, 'year'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: [monthAttr, yearAttr],
      order: [[yearAttr, 'ASC'], [monthAttr, 'ASC']],
      limit: 6,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/top-events
router.get('/top-events', authMiddleware, roleMiddleware('manager', 'admin'), async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['tickets_sold', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'sport', 'tickets_sold', 'capacity', 'ticket_price'],
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

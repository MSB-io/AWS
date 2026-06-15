const express = require('express');
const { User } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/fans (admin/manager)
router.get('/', authMiddleware, roleMiddleware('manager', 'admin'), async (req, res) => {
  try {
    const fans = await User.findAll({
      where: { role: 'fan' },
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
    });
    res.json(fans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/fans/:id (admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'Fan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

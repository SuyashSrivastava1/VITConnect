const express = require('express');
const { login } = require('../services/authService');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { reg_no } = req.body;
    if (!reg_no) {
      return res.status(400).json({ error: 'Registration number is required' });
    }
    
    const result = await login(reg_no);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

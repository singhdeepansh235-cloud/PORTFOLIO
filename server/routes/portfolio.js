const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const PORTFOLIO_FILE = path.join(__dirname, '..', 'data', 'portfolio.json');

// GET /api/portfolio — Return all portfolio data
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
    const portfolio = JSON.parse(data);
    res.json({ success: true, data: portfolio });
  } catch (error) {
    console.error('Portfolio data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load portfolio data.'
    });
  }
});

// GET /api/portfolio/projects — Return only projects
router.get('/projects', (req, res) => {
  try {
    const data = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
    const portfolio = JSON.parse(data);
    res.json({ success: true, data: portfolio.projects });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load projects.' });
  }
});

// GET /api/portfolio/skills — Return only skills
router.get('/skills', (req, res) => {
  try {
    const data = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
    const portfolio = JSON.parse(data);
    res.json({ success: true, data: portfolio.skills });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load skills.' });
  }
});

module.exports = router;

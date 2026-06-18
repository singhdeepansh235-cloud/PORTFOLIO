const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const MESSAGES_FILE = path.join(__dirname, '..', 'data', 'messages.json');

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sanitize string input
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

// POST /api/contact — Handle contact form submissions
router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required.'
      });
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name: sanitize(name),
      email: sanitize(email),
      subject: sanitize(subject || 'No Subject'),
      message: sanitize(message),
      timestamp: new Date().toISOString(),
      read: false
    };

    // Read existing messages
    let messages = [];
    try {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      messages = JSON.parse(data);
    } catch (err) {
      messages = [];
    }

    // Add new message
    messages.push(sanitizedData);

    // Write back to file
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
});

// GET /api/contact — Get all messages (for admin)
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    const messages = JSON.parse(data);
    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: true, messages: [] });
  }
});

module.exports = router;

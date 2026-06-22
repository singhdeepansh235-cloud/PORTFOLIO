const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
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

// Create Nodemailer Transporter
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || pass === 'your-gmail-app-password') {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
};

// POST /api/contact — Handle contact form submissions
router.post('/', async (req, res) => {
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

    // 1. Read & Save to Local JSON File (Always do this as backup)
    let messages = [];
    try {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      messages = JSON.parse(data);
    } catch (err) {
      messages = [];
    }

    messages.push(sanitizedData);

    try {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    } catch (writeErr) {
      console.error('Failed to write message to local storage:', writeErr);
    }

    // 2. Attempt Email Delivery via Nodemailer
    const transporter = createTransporter();
    let emailSent = false;
    let emailError = null;

    if (transporter) {
      const mailOptions = {
        from: `"${sanitizedData.name}" <${process.env.EMAIL_USER}>`,
        to: 'singhdeepansh235@gmail.com', // Always deliver to user's main email
        replyTo: sanitizedData.email,
        subject: `Portfolio Contact: ${sanitizedData.subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; color: #333333;">
            <h2 style="color: #a259ff; border-bottom: 2px solid #a259ff; padding-bottom: 10px; margin-top: 0;">New Message from Portfolio Website</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0; width: 100px;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${sanitizedData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${sanitizedData.email}" style="color: #3b82f6; text-decoration: none;">${sanitizedData.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Subject:</td>
                <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${sanitizedData.subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Date:</td>
                <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${new Date(sanitizedData.timestamp).toLocaleString()}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #a259ff;">
              <h3 style="margin-top: 0; color: #333;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #555; margin-bottom: 0;">${sanitizedData.message}</p>
            </div>
            <p style="font-size: 0.8em; color: #888; text-align: center; margin-top: 30px; border-top: 1px solid #f0f0f0; padding-top: 10px; margin-bottom: 0;">
              This message was sent from your portfolio website contact form.
            </p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (err) {
        console.error('Nodemailer failed to send email:', err);
        emailError = err.message;
      }
    } else {
      console.warn('Nodemailer not configured or using placeholder credentials. Skipping email delivery.');
      emailError = 'Transporter not configured';
    }

    // 3. Return Response
    if (emailSent) {
      res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully and email notification was delivered.'
      });
    } else {
      // If email fails but it's saved locally, we still return success to the user,
      // but we add a note so frontend developer logs can inspect.
      res.status(201).json({
        success: true,
        message: 'Thank you! Your message was saved successfully.',
        warning: `Email sending skipped or failed: ${emailError}`
      });
    }
  } catch (error) {
    console.error('Contact form endpoint error:', error);
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

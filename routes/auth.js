const express = require('express');
const router = express.Router();
const passport = require('passport');

// @route   GET /auth/google
// @desc    Authenticate with Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /auth/google/callback
// @desc    Google auth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/auth/profile');
  }
);

// @route   GET /auth/profile
// @desc    Get current logged in user (protected)
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated. Please login at /auth/google' });
  }
  res.status(200).json({
    message: 'You are logged in!',
    user: {
      displayName: req.user.displayName,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      profilePhoto: req.user.profilePhoto
    }
  });
});

// @route   GET /auth/logout
// @desc    Logout user
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
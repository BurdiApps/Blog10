const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to Blog10 API! Available endpoints: /ideas, /sessions, /api-docs');
});

router.use('/ideas', require('./ideas'));
router.use('/sessions', require('./sessions'));

module.exports = router;
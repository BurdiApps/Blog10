const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Blog10 API - Welcome!');
});

router.use('/ideas', require('./ideas'));
router.use('/sessions', require('./sessions'));

module.exports = router;
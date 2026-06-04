const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessions');
const {
  sessionValidationRules,
  handleValidation
} = require('../middleware/validation');

router.get('/', sessionsController.getAll);
router.get('/:id', sessionsController.getSingle);
router.post('/', sessionValidationRules, handleValidation, sessionsController.createSession);
router.put('/:id', sessionValidationRules, handleValidation, sessionsController.updateSession);
router.delete('/:id', sessionsController.deleteSession);

module.exports = router;
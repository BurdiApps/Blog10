const express = require('express');
const router = express.Router();
const ideasController = require('../controllers/ideas');
const { ideaValidationRules, handleValidation } = require('../middleware/validation');
const { isAuthenticated } = require('../middleware/auth');

// Public routes
router.get('/', ideasController.getAll);
router.get('/:id', ideasController.getSingle);

// Protected routes (require login)
router.post('/', isAuthenticated, ideaValidationRules, handleValidation, ideasController.createIdea);
router.put('/:id', isAuthenticated, ideaValidationRules, handleValidation, ideasController.updateIdea);
router.delete('/:id', isAuthenticated, ideasController.deleteIdea);

module.exports = router;
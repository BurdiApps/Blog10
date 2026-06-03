const express = require('express');
const router = express.Router();
const ideasController = require('../controllers/ideas');
const { ideaValidationRules, handleValidation } = require('../middleware/validation');

router.get('/', ideasController.getAll);
router.get('/:id', ideasController.getSingle);
router.post('/', ideaValidationRules, handleValidation, ideasController.createIdea);
router.put('/:id', ideaValidationRules, handleValidation, ideasController.updateIdea);
router.delete('/:id', ideasController.deleteIdea);

module.exports = router;
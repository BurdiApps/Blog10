const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const ideaValidationRules = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('title').isString().notEmpty().withMessage('title is required'),
  body('description').isString().notEmpty().withMessage('description is required'),
  body('category').isString().notEmpty().withMessage('category is required'),
  body('tags').isArray().withMessage('tags must be an array'),
  body('status').isIn(['draft', 'refined', 'abandoned']).withMessage('status must be draft, refined, or abandoned'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5')
];

const sessionValidationRules = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('sessionName').isString().notEmpty().withMessage('sessionName is required'),
  body('prompt').isString().notEmpty().withMessage('prompt is required'),
  body('ideas').isArray().withMessage('ideas must be an array'),
  body('notes').isString().withMessage('notes must be a string')
];

module.exports = {
  handleValidation,
  ideaValidationRules,
  sessionValidationRules
};
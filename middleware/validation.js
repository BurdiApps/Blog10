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
  body('title').notEmpty().withMessage('title is required'),
  body('description').notEmpty().withMessage('description is required'),
  body('category').notEmpty().withMessage('category is required'),
  body('tags').isArray().withMessage('tags must be an array'),
  body('status').notEmpty().withMessage('status is required'),
  body('rating').isNumeric().withMessage('rating must be a number')
];

const sessionValidationRules = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('sessionName').notEmpty().withMessage('sessionName is required'),
  body('prompt').notEmpty().withMessage('prompt is required'),
  body('ideas').isArray().withMessage('ideas must be an array'),
  body('notes').optional().isString().withMessage('notes must be a string')
];

module.exports = {
  handleValidation,
  ideaValidationRules,
  sessionValidationRules
};
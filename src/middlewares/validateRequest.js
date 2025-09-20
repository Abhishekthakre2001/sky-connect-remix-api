const { body, validationResult } = require("express-validator");

// ✅ Validation rules for Employee requests
const validateEmployee = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("position").isString().notEmpty().withMessage("Position is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateEmployee };

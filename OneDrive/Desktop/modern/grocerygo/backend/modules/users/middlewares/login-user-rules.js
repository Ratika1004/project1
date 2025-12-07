const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const messages = {
  EN: {
    emailRequired: "Email is required",
    emailInvalid: "Email must be a valid email address",
    passwordRequired: "Password is required",
  },
};

const msg = (key) => (_, { req }) => messages[req.cookies?.lang || "EN"][key];

const loginRules = [
  body("email").notEmpty().withMessage(msg("emailRequired")).isEmail().withMessage(msg("emailInvalid")).normalizeEmail(),
  body("password").notEmpty().withMessage(msg("passwordRequired")),
  checkValidation,
];

module.exports = loginRules;


import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const validateEmail = body("email")
  .trim()
  .isEmail()
  .withMessage("Enter a valid email address")
  .normalizeEmail();

const validatePassword = body("password")
  .isString()
  .withMessage("Password must be a string")
  .isLength({ min: 8, max: 72 })
  .withMessage("Password must be 8–72 characters");

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage("Name must be 2–60 characters"),
    validateEmail,
    validatePassword,
  ],
  register
);

router.post(
  "/login",
  [
    validateEmail,
    body("password")
      .isString()
      .withMessage("Password is required")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  login
);

router.get("/me", protect, getMe);

export default router;

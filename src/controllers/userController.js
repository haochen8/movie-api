/**
 * @file Defines the user controller.
 * @module controllers/userController
 * @author Hao Chen
 * @version 1.0.0
 */

import { logger } from "../config/winston.js";
import { UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export class UserController {
  /**
   * Registers a new user.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async register(req, res) {
    try {
      const { email, password } = req.body;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new UserModel({ email, password });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
      logger.info("User registered successfully", { email });
    } catch (error) {
      res.status(500).json({ message: "Error registering user" });
      logger.error("Error registering user", { error });
    }
  }
  /**
   * Authenticates a user.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.authenticate(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      logger.info("User logged in successfully", { email });
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
      logger.error("Error logging in", { error });
    }
  }
}

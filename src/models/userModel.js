/**
 * @file Defines the user model.
 * @module models/userModel
 * @author Hao Chen
 * @version 1.0.0
 */

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
import { BASE_SCHEMA } from "./baseSchema.js";

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email address is required."],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minLength: [10, "The password must be of minimum length 10 characters."],
    maxLength: [256, "The password must be of maximum length 256 characters."],
  },
});

schema.add(BASE_SCHEMA);

// Salts and hashes password before save.
schema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Authenticates a user.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password.
 * @returns {Promise<UserModel>} A promise that resolves with the user if authentication was successful.
 */
schema.statics.authenticate = async function (email, password) {
  const userDocument = await this.findOne({ email });

  // If no user found or password is wrong, throw an error.
  if (
    !userDocument ||
    !(await bcrypt.compare(password, userDocument?.password))
  ) {
    throw new Error("Invalid credentials.");
  }

  // User found and password correct, return the user.
  return userDocument;
};

// Create a model using the schema.
export const UserModel = mongoose.model("User", schema);

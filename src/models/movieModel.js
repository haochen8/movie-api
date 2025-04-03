/**
 * @file Defines the movie model.
 * @module models/movie
 * @author Hao Chen
 * @version 1.0.0
 */

import mongoose from "mongoose";
import { BASE_SCHEMA } from "./baseSchema.js";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    release_year: { type: Number, required: true },
    genre: { type: String, required: true },
    description: { type: String },
    tmdbId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

movieSchema.add(BASE_SCHEMA);

export const MovieModel = mongoose.model("Movie", movieSchema);

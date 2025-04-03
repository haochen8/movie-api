/**
 * @file Defines the rating model.
 * @module models/ratingModel
 * @author Hao Chen
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

const RatingSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  text: { type: String, required: true }
})

RatingSchema.add(BASE_SCHEMA)

export const RatingModel = mongoose.model('Rating', RatingSchema)

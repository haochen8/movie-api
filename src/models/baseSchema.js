/**
 * @file Defines the base schema.
 * @module models/baseSchema
 * @author Hao Chen
 * @version 3.1.0
 */

import mongoose from 'mongoose'
import { logger } from '../config/winston.js'

// Options to use converting the document to a plain object and JSON.
const convertOptions = {
  getters: true, // Include getters and virtual properties.
  versionKey: false, // Exclude the __v property.
  /**
   * Transforms the document, removing the _id property.
   *
   * @param {object} doc - The mongoose document which is being converted.
   * @param {object} ret - The plain object representation which has been converted.
   * @returns {object} The transformed object.
   * @see https://mongoosejs.com/docs/api.html#document_Document-toObject
   */
  transform: (doc, ret) => {
    delete ret._id // Exclude the _id property.
    ret.id = doc._id // Include the id property.
    return ret
  }
}

// Create a schema.
const baseSchema = new mongoose.Schema({}, {
  timestamps: true,
  toObject: convertOptions,
  toJSON: convertOptions,
  optimisticConcurrency: false
})

export const BASE_SCHEMA = Object.freeze(baseSchema)

/**
 * @file Defines the rating router.
 * @module routes/api/ratingRouter
 * @author Hao Chen
 * @version 1.0.0
 */

import express from 'express'
import { RatingController } from '../../controllers/ratingController.js'

export const router = express.Router()
const controller = new RatingController()

// Rating routes
router.get('/', (req, res, next) => { controller.getAllRatings(req, res, next) })
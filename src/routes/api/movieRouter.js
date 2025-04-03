/**
 * @file Defines the movie router.
 * @module routes/api/movieRouter
 * @author Hao Chen
 * @version 1.0.0
 */

import express from 'express'
import { MovieController } from '../../controllers/movieController.js'
import { auth } from '../../middlewares/auth.js'

export const router = express.Router()
const controller = new MovieController()

// Movie routes
router.get('/', (req, res, next) => { controller.getAllMovies(req, res, next) })
router.get('/:id', (req, res, next) => { controller.getMovieById(req, res, next) })
router.get('/:id/ratings', (req, res, next) => { controller.getRatingsForMovie(req, res, next) })
router.post('/', auth, (req, res, next) => { controller.createMovie(req, res, next) })
router.put('/:id', auth, (req, res, next) => { controller.updateMovie(req, res, next) })
router.delete('/:id', auth, (req, res, next) => { controller.deleteMovie(req, res, next) })

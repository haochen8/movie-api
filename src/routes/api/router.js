/**
 * @file API version 1 router.
 * @module routes/router
 * @author Hao Chen
 * @version 1.0.0
 */

import express from 'express'
import { router as movieRouter } from './movieRouter.js'
import { router as authRouter } from './authRouter.js'
import { router as actorRouter } from './actorRouter.js'
import { router as ratingRouter } from './ratingRouter.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/movies', movieRouter)
router.use('/auth', authRouter)
router.use('/actors', actorRouter)
router.use('/ratings', ratingRouter)

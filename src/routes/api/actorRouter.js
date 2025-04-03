/**
 * @file Defines the actor router.
 * @module routes/api/actorRouter
 * @author Hao Chen
 * @version 1.0.0
 */

import express from 'express'
import { ActorController } from '../../controllers/actorController.js'

export const router = express.Router()
const controller = new ActorController()

// Actor routes
router.get('/', (req, res, next) => { controller.getAllActors(req, res, next) })
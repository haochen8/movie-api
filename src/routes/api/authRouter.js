/**
 * @file Defines the auth router.
 * @module routes/api/authRouter
 * @author Hao Chen
 * @version 1.0.0
 */

import express from 'express'
import { UserController } from '../../controllers/userController.js'

export const router = express.Router()
const controller = new UserController()

// Auth routes
router.post('/register', (req, res, next) => { controller.register(req, res, next) })
router.post('/login', (req, res, next) => { controller.login(req, res, next) })
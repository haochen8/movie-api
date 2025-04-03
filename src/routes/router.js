/**
 * @file Defines the main router.
 * @module routes/router
 * @author Hao Chen
 * @version 1.0.0
 */

import express from 'express'
import http from 'node:http'
import { router as Router } from './api/router.js'

export const router = express.Router()

router.use('/api', Router)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode

  next(error)
})

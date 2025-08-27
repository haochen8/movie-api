/**
 * @file Defines the main application.
 * @module src/server
 * @author Hao Chen
 * @version 1.0.0
 */

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import { logger } from './config/winston.js'
import { morganLogger } from './config/morgan.js'
import { connectToDatabase } from './config/mongoose.js'
import { router } from './routes/router.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger/swagger.js'
import http from 'http'

// Load environment variables from .env file
dotenv.config()

try {
  await connectToDatabase(process.env.MONGODB_URI)
  const app = express()
  app.use(cors())
  app.use(helmet())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(morganLogger)

  // Swagger setup
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  
  // Routes
  app.use('/', router)

  app.use((req, res) => {
    res.status(404).json({ message: "Not Found" })
  })

  // Error handler
  app.use((err, req, res, next) => {
    logger.error(err.message, { error: err })

    if (!err.status) {
      if (err.name === 'ValidationError') {
        err.status = 400
      }
      if (err.name === 'CastError') {
        err.status = 400
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        err.status = 400
      }
    }

    if (process.env.NODE_ENV === 'production') {
      if (!err.status) {
        err.status = 500
        err.message = http.STATUS_CODES[err.status]
      }
      res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })

      return
    }
    return res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || 'Internal Server Error'
    })
  })
  // Start the server
  const server = app.listen(process.env.PORT, () => {
    logger.info(`Server running at http://localhost:${server.address().port}/api/`)
    logger.info('Press Ctrl-C to terminate...')
  })
} catch (error) {
  logger.error('Error starting server:', error)
  process.exit(1)
}
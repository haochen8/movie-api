import request from 'supertest'
import express from 'express'
import { router as movieRoutes } from '../src/routes/api/movieRouter.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connectToDatabase } from '../src/config/mongoose.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/movies', movieRoutes)

beforeAll(async () => {
  await connectToDatabase(process.env.MONGODB_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('GET /movies', () => {
  it('should return paginated movies', async () => {
    const res = await request(app).get('/movies?page=1&limit=3')
    expect(res.statusCode).toBe(200)
    expect(res.body.data.length).toBeLessThanOrEqual(3)
  })

  it('should filter by genre and year', async () => {
    const res = await request(app).get('/movies?genre=Action&year=2010')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})

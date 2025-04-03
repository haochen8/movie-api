/**
 * @file Defines the authentication middleware.
 * @module middlewares/auth
 * @author Hao Chen
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'

/**
 * Middleware to authenticate JWT tokens.
 * 
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @param {*} next - The next middleware function.
 * @returns 
 */
export function auth(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    console.log('No authorization header provided')
    return res.status(401).json({ message: 'No authorization header provided' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    console.log('No token provided')
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.log('Invalid token', error.message)
    return res.status(401).json({ message: 'Invalid token' })
  }
}
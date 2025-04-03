/**
 * @file Defines the movie controller.
 * @module controllers/movieController
 * @author Hao Chen
 * @version 1.0.0
 */

import { logger } from "../config/winston.js";
import { MovieModel } from "../models/movieModel.js";
import { RatingModel } from "../models/ratingModel.js";
import { generateLinks } from "../utils/hateoas.js";

/**
 * MovieController class
 * Handles movie-related operations
 */
export class MovieController {
  /**
   * Retrieves all movies from the database.
   * @returns {Promise<Array>} List of all movies.
   */
  async getAllMovies(req, res, next) {
    try {
      const { genre, year, page = 1, limit = 10 } = req.query;
      const query = {};
      if (genre) {
        query.genre = genre;
      }
      if (year) {
        query.year = year;
      }
      logger.info(`Retrieving movies with query: ${JSON.stringify(query)}`);
      const movies = await MovieModel.find(query)
        .limit(parseInt(limit))
        .skip((page - 1) * parseInt(limit));

      const totalMovies = await MovieModel.countDocuments(query);
      // Generate HATEOAS links for each movie
      const moviesWithLinks = movies.map((movie) => ({
        ...movie.toObject(),
        _links: generateLinks("movie", movie._id),
      }));

      res.status(200).json({
        page: parseInt(page),
        limit: parseInt(limit),
        totalMovies,
        _links: {
          self: { href: `/api/movies?page=${page}&limit=${limit}` },
        },
        data: moviesWithLinks,
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving movies" });
      logger.error("Error retrieving movies", { error });
    }
  }

  /**
   * Retrieves a movie by its ID.
   * @param {string} id - The ID of the movie to retrieve.
   * @returns {Promise<Object>} The movie object.
   */
  async getMovieById(req, res, next) {
    try {
      const { id } = req.params;
      logger.info(`Retrieving movie with ID: ${id}`);
      const movie = await MovieModel.findById(id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      logger.info(`Retrieved movie with ID: ${id}`);
      res.status(200).json({
        ...movie.toObject(),
        _links: generateLinks("movie", movie._id),
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving movie" });
      logger.error("Error retrieving movie", { error });
    }
  }

  /**
   * Creates a new movie.
   * @param {Object} req - The request object containing movie data.
   * @returns {Promise<Object>} The created movie object.
   */
  async createMovie(req, res, next) {
    try {
      const movie = new MovieModel(req.body);
      await movie.save();
      logger.info("Movie created successfully", { movie });
      res.status(201).json({
        ...movie.toObject(),
        _links: generateLinks("movie", movie._id),
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating movie" });
      logger.error("Error creating movie", { error });
    }
  }

  /**
   * Updates a movie by its ID.
   * @param {string} id - The ID of the movie to update.
   * @param {Object} req - The request object containing updated movie data.
   * @returns {Promise<Object>} The updated movie object.
   */
  async updateMovie(req, res, next) {
    try {
      const movie = await MovieModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      logger.info("Movie updated successfully", { movie });
      res.status(200).json({ message: "Movie updated successfully", movie });
    } catch (error) {
      res.status(400).json({ message: "Error updating movie" });
      logger.error("Error updating movie", { error });
    }
  }

  /**
   * Deletes a movie by its ID.
   * @param {string} id - The ID of the movie to delete.
   * @returns {Promise<void>}
   */
  async deleteMovie(req, res, next) {
    try {
      const movie = await MovieModel.findByIdAndDelete(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      logger.info("Movie deleted successfully", { movie });
      res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting movie" });
      logger.error("Error deleting movie", { error });
    }
  }

  /**
   * Retrieves ratings for a specific movie.
   * @param {string} id - The ID of the movie.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise<void>}
   */
  async getRatingsForMovie(req, res, next) {
    try {
      const { id } = req.params;
      logger.info(`Retrieving ratings for movie with ID: ${id}`);

      const movie = await MovieModel.findById(id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      const ratings = await RatingModel.find({ movie: id }).populate(
        "movie",
        "title"
      );
      if (!ratings) {
        return res.status(404).json({ message: "Ratings not found" });
      }
      res.status(200).json({
        movie: {
          id: movie._id,
          title: movie.title,
          _links: generateLinks("movie", movie._id),
        },
        ratings: ratings.map((r) => ({
          ...r.toObject(),
          _links: generateLinks("rating", r._id),
        })),
        _links: {
          self: { href: `/api/movies/${movie._id}/ratings` },
          movie: { href: `/api/movies/${movie._id}` },
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving ratings" });
      logger.error("Error retrieving ratings", { error });
    }
  }
}

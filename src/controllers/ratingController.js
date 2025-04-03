/**
 * @file Defines the rating controller.
 * @module controllers/ratingController
 * @author Hao Chen
 * @version 1.0.0
 */

import { logger } from "../config/winston.js";
import { RatingModel } from "../models/ratingModel.js";
import { generateLinks } from "../utils/hateoas.js";

/**
 * @class RatingController
 * @description Controller for handling rating-related requests.
 */
export class RatingController {
  /**
   * Retrieves all ratings from the database.
   *
   * @description Retrieves all ratings from the database.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async getAllRatings(req, res, next) {
    try {
      const ratings = await RatingModel.find().populate("movie", "title");
      // Generate HATEOAS links for each rating
      const ratingsWithLinks = ratings.map((rating) => ({
        ...rating.toObject(),
        _links: {
          self: generateLinks("rating", rating._id).self,
          movie: {
            href: `/api/movies/${rating.movie?._id || rating.movie}`,
            title: rating.movie?.title || undefined,
          },
        },
      }));
      res.status(200).json({
        total: ratings.length,
        _links: {
          self: { href: "/api/ratings" },
        },
        data: ratingsWithLinks,
      });
      logger.info("Fetched all ratings", { count: ratings.length });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Error retrieving ratings" });
    }
  }

  /**
   * Retrieves a rating by its ID.
   *
   * @description Retrieves a rating by its ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async getRatingsForMovie(req, res, next) {
    try {
      const ratings = await RatingModel.find({ movie: req.params.id });
      if (!ratings) {
        return res.status(404).json({ message: "Ratings not found" });
      }
      // Generate HATEOAS links for each rating
      const ratingsWithLinks = ratings.map((rating) => ({
        ...rating.toObject(),
        _links: {
          self: generateLinks("rating", rating._id).self,
          movie: {
            href: `/api/movies/${req.params.id}`,
          },
        },
      }));
      res.status(200).json({
        movieId: req.params.id,
        total: ratings.length,
        _links: {
          self: { href: `/api/movies/${req.params.id}/ratings` },
          movie: { href: `/api/movies/${req.params.id}` },
        },
        data: ratingsWithLinks,
      });
      logger.info("Fetched ratings for movie", { movieId: req.params.id });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Error retrieving ratings" });
    }
  }
}

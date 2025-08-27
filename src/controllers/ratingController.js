import { logger } from "../config/winston.js";
import { RatingModel } from "../models/ratingModel.js";
import { generateLinks } from "../utils/hateoas.js";

/**
 * Encapsulates the logic for handling requests related to ratings.
 */
export class RatingController {
  async getAllRatings(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip = (page - 1) * limit;
      const includeDetails = req.query.details === "true";

      let query = RatingModel.find({}, "text movie")
        .skip(skip)
        .limit(limit)
        .lean();

      if (includeDetails) {
        query = query.populate("movie", "title");
      }

      const ratings = await query;
      const totalItems = await RatingModel.countDocuments();

      // Generate HATEOAS links for each rating and their movies
      const ratingsWithLinks = ratings.map((rating) => ({
        ...rating,
        _links: {
          self: generateLinks("rating", rating._id).self,
          movie: {
            href: `/api/movies/${rating.movie?._id || rating.movie}`,
            title: rating.movie?.title || undefined,
          },
        },
      }));

      res.status(200).json({
        page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        _links: { self: { href: `/api/ratings?page=${page}&limit=${limit}` } },
        data: ratingsWithLinks,
      });

      logger.info("Fetched all ratings", { count: ratings.length });
    } catch (error) {
      logger.error("Error retrieving ratings", { error });
      return next(error);
    }
  }

  /**
   * Get ratings for a specific movie.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns
   */
  async getRatingsForMovie(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const ratings = await RatingModel.find({ movie: req.params.id }, "text")
        .skip(skip)
        .limit(limit)
        .lean();

      const totalRatingCount = await RatingModel.countDocuments({
        movie: req.params.id,
      });

      if (!ratings || ratings.length === 0) {
        return res.status(404).json({ message: "Ratings not found" });
      }

      const ratingsWithLinks = ratings.map((rating) => ({
        ...rating,
        _links: {
          self: generateLinks("rating", rating._id).self,
          movie: { href: `/api/movies/${req.params.id}` },
        },
      }));

      res.status(200).json({
        movieId: req.params.id,
        page,
        totalPages: Math.ceil(totalRatingCount / limit),
        totalItems: totalRatingCount,
        _links: {
          self: {
            href: `/api/movies/${req.params.id}/ratings?page=${page}&limit=${limit}`,
          },
          movie: { href: `/api/movies/${req.params.id}` },
        },
        data: ratingsWithLinks,
      });

      logger.info("Fetched ratings for movie", { movieId: req.params.id });
    } catch (error) {
      logger.error("Error retrieving ratings", { error });
      return next(error);
    }
  }
}

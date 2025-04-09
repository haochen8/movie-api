/**
 * @file Defines the actor controller.
 * @module controllers/actorController
 * @author Hao Chen
 * @version 1.0.0
 */

import { logger } from "../config/winston.js";
import { ActorModel } from "../models/actorModel.js";
import { generateLinks } from "../utils/hateoas.js";

/**
 * ActorController class
 * @class
 * @classdesc Controller for managing actors.
 */
export class ActorController {
  /**
   * Get all actors.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async getAllActors(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip = (page - 1) * limit;
      const includeDetails = req.query.includeDetails === "true";

      let query = ActorModel.find().skip(skip).limit(limit).lean();
      if (includeDetails) {
        query = query.populate("movies_played", "title");
      }
      const actors = await query;
      const totalActors = await ActorModel.countDocuments();

      // Generate HATEOAS links for each actor and their movies
      const actorsWithLinks = actors.map((actor) => ({
        ...actor,
        _links: {
          self: generateLinks("actor", actor._id).self,
          movies:
            includeDetails && Array.isArray(actor.movies_played)
              ? actor.movies_played.map((movie) => ({
                  href: `/api/movies/${movie._id}`,
                  title: movie.title,
                }))
              : [],
        },
      }));
      res.status(200).json({
        page,
        totalPages: Math.ceil(totalActors / limit),
        totalActors,
        _links: { self: { href: `/api/actors?page=${page}&limit=${limit}` } },
        data: actorsWithLinks,
      });
      logger.info("Fetched all actors with pagination", {
        count: actors.length,
      });
      logger.debug("Sample actor:", actors[0]);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Error fetching actors" });
    }
  }
}

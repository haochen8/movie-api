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
      const actors = await ActorModel.find().populate("movies_played", "title");
      // Generate HATEOAS links for each actor
      const actorsWithLinks = actors.map((actor) => ({
        ...actor.toObject(),
        _links: {
          self: generateLinks("actor", actor._id).self,
          movies: actor.movies_played.map((movie) => ({
            href: `/api/movies/${movie._id}`,
            title: movie.title
          }))
        }
      }));
      res.status(200).json({
        total: actors.length,
        _links: {
          self: { href: "/api/actors" }
        },
        data: actorsWithLinks
      });
      logger.info("Fetched all actors", { count: actors.length });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Error fetching actors" });
    }
  }
}
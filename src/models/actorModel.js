/**
 * @file Defines the actor model.
 * @module models/actorModel
 * @author Hao Chen
 * @version 1.0.0
 */

import mongoose from "mongoose";
import { BASE_SCHEMA } from "./baseSchema.js";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  movies_played: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
}, {
  timestamps: true,
})

schema.add(BASE_SCHEMA)

export const ActorModel = mongoose.model("Actor", schema)
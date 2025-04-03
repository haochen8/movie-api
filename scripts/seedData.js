import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { connectToDatabase } from "../src/config/mongoose.js";
import { MovieModel } from "../src/models/movieModel.js";
import { ActorModel } from "../src/models/actorModel.js";
import { RatingModel } from "../src/models/ratingModel.js";

dotenv.config();

// Set up paths
const MOVIES_PATH = "./data/movies_metadata.csv";
const CREDITS_PATH = "./data/credits.csv";
const RATINGS_PATH = "./data/ratings_small.csv";

// Helper functions
const parseJSON = (str) => {
  try {
    return JSON.parse(str.replace(/'/g, '"').replace(/None/g, "null"));
  } catch {
    return [];
  }
};

const extractYear = (releaseDate) => {
  if (!releaseDate || !/^\d{4}/.test(releaseDate)) return null;
  return parseInt(releaseDate.slice(0, 4));
};

// Data structures
const movies = [];
const actorsMap = new Map();
const ratings = [];

const movieIdMap = new Map();

await connectToDatabase(process.env.MONGODB_URI);
console.log("Connected to MongoDB");

// Load movies, actors, and ratings from CSV files
const loadMovies = () =>
  new Promise((resolve) => {
    fs.createReadStream(MOVIES_PATH)
      .pipe(csv())
      .on("data", (row) => {
        const tmdbId = row.id?.trim();
        const title = row.title?.trim();
        const year = extractYear(row.release_date);
        const genres = parseJSON(row.genres);
        const genre = genres[0]?.name || "Unknown";
        const description = row.overview || "No description";

        if (!tmdbId || !title || !year) return;

        movies.push({
          tmdbId,
          title,
          release_year: year,
          genre,
          description,
        });
      })
      .on("end", async () => {
        const seen = new Set();
        const uniqueMovies = movies.filter((m) => {
          if (seen.has(m.tmdbId)) return false;
          seen.add(m.tmdbId);
          return true;
        });

        await MovieModel.deleteMany({});
        const inserted = await MovieModel.insertMany(uniqueMovies);
        inserted.forEach((m) => movieIdMap.set(m.tmdbId, m._id));
        console.log(`Inserted ${inserted.length} unique movies`);
        resolve(inserted);
      });
  });

// Load actors from CSV file
const loadActors = () =>
  new Promise((resolve) => {
    fs.createReadStream(CREDITS_PATH)
      .pipe(csv())
      .on("data", (row) => {
        const tmdbId = row.id?.trim();
        const cast = parseJSON(row.cast);
        const movieId = movieIdMap.get(tmdbId);
        if (!movieId) return;

        cast.slice(0, 5).forEach((actor) => {
          const name = actor?.name?.trim();
          if (!name) return;

          if (!actorsMap.has(name)) {
            actorsMap.set(name, { name, movies_played: [movieId] });
          } else {
            const existing = actorsMap.get(name);
            if (!existing.movies_played.includes(movieId)) {
              existing.movies_played.push(movieId);
            }
          }
        });
      })
      .on("end", async () => {
        await ActorModel.deleteMany({});
        const inserted = await ActorModel.insertMany([...actorsMap.values()]);
        console.log(`Inserted ${inserted.length} actors`);
        resolve();
      });
  });

// Load ratings from CSV file
const loadRatings = () =>
  new Promise((resolve) => {
    fs.createReadStream(RATINGS_PATH)
      .pipe(csv())
      .on("data", (row) => {
        const tmdbId = row.movieId?.trim();
        const movie = movieIdMap.get(tmdbId);
        if (!movie) return;
        ratings.push({ movie, text: `Rating: ${row.rating}` });
      })
      .on("end", async () => {
        await RatingModel.deleteMany({});
        const inserted = await RatingModel.insertMany(ratings);
        console.log(`Inserted ${inserted.length} ratings`);
        resolve();
      });
  });

// Main seeding function
(async () => {
  try {
    const insertedMovies = await loadMovies();
    await loadActors();
    await loadRatings();
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
})();

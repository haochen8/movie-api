/**
 * @file Defines the main application.
 * @module src/server
 * @author Hao Chen
 * @version 1.0.0
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./config/winston.js";
import { morganLogger } from "./config/morgan.js";
import { connectToDatabase } from "./config/mongoose.js";
import { router } from "./routes/router.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger.js";

// Load environment variables from .env file
dotenv.config();

try {
  await connectToDatabase(process.env.MONGODB_URI);
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morganLogger);

  // Swagger setup
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Routes
  app.use("/", router);

  // Error handler
  app.use((err, req, res, next) => {
    logger.error(err.message, { error: err });

    if (process.env.NODE_ENV === "production") {
      if (!err.status) {
        err.status = 500;
        err.message = http.STATUS_CODES[err.status];
      }
      res.status(err.status).json({
        status: err.status,
        message: err.message,
      });

      return;
    }
    const copy = JSON.decycle(err, { includeNonEnumerableProperties: true });

    return res.status(err.status || 500).json(copy);
  });
  // Start the server
  const server = app.listen(process.env.PORT || 3000, () => {
    const port = server.address().port;
    logger.info(
      `Server running at http://localhost:${server.address().port}/api/`
    );
    logger.info(`Swagger docs available at /api-docs`);
  });
} catch (error) {
  logger.error("Error starting server:", error);
  process.exit(1);
}

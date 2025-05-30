export default {
  openapi: "3.0.0",
  info: {
    title: "Movie API",
    version: "1.0.0",
    description: "A RESTful API for managing movies, actors, and ratings.",
  },
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 10 },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "User already exists" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login a user and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/movies": {
      get: {
        summary: "Get all movies",
        parameters: [
          { in: "query", name: "genre", schema: { type: "string" } },
          { in: "query", name: "year", schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "List of movies",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Movie" },
                    },
                    _links: {
                      type: "object",
                      properties: {
                        self: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new movie",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Movie" },
            },
          },
        },
        responses: {
          201: { description: "Movie created" },
          400: { description: "Invalid data" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/movies/{id}": {
      get: {
        summary: "Get a specific movie by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Movie details with HATEOAS links",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/Movie" },
                    {
                      type: "object",
                      properties: {
                        _links: {
                          type: "object",
                          properties: {
                            self: { type: "string" },
                            ratings: { type: "string" },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          404: { description: "Movie not found" },
        },
      },
    },
    "/api/movies/{id}/ratings": {
      get: {
        summary: "Get ratings for a specific movie",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "List of ratings for a movie",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    movie: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                      },
                    },
                    ratings: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Rating" },
                    },
                  },
                },
              },
            },
          },
          404: { description: "Movie not found" },
        },
      },
    },
    "/api/actors": {
      get: {
        summary: "Get all actors with pagination",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              default: 1,
            },
            description: "Page number (starting from 1)",
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              default: 100,
            },
            description: "Number of actors per page",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of actors",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                          movies_played: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                title: {
                                  type: "string",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    page: {
                      type: "integer",
                    },
                    totalPages: {
                      type: "integer",
                    },
                    totalItems: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/ratings": {
      get: {
        summary: "Get all ratings",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              default: 1,
            },
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              default: 100,
            },
            description: "Number of ratings per page",
          },
        ],
        responses: {
          200: {
            description: "Paginated list of ratings",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Rating",
                      },
                    },
                    page: {
                      type: "integer",
                    },
                    totalPages: {
                      type: "integer",
                    },
                    totalItems: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Movie: {
        type: "object",
        properties: {
          title: { type: "string", example: "The Matrix" },
          release_year: { type: "integer", example: 1999 },
          genre: { type: "string", example: "Sci-Fi" },
          description: {
            type: "string",
            example: "A hacker discovers reality is a simulation.",
          },
        },
        required: ["title", "release_year", "genre"],
      },
      Rating: {
        type: "object",
        properties: {
          text: { type: "string", example: "Rating: 4.5" },
          movie: {
            type: "object",
            properties: {
              title: { type: "string" },
            },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

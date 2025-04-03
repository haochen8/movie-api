# Movie API

A RESTful API for managing **Movies**, **Actors**, **Ratings**, and **User Authentication**, built with **Node.js**, **Express**, and **MongoDB**. This project also includes JWT-based authentication, HATEOAS links, Swagger documentation, and automated testing via Postman and Newman.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Swagger Documentation](#swagger-documentation)
- [Postman Testing](#postman-testing)
- [Seed Data](#seed-data)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)

---

## Features

- Full CRUD for movies
- Ratings per movie
- Actor data with linked movies
- Secure JWT Authentication
- HATEOAS links for all main resources
- Interactive Swagger API Docs
- Automated testing with Postman & Newman
- Seed script for importing movies, actors & ratings

---

## Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** for Authentication
- **Winston** for logging
- **Swagger (OpenAPI)** for documentation
- **Postman + Newman** for testing
- **dotenv**, **validator**, **bcrypt**

---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone git@gitlab.lnu.se:1dv027/student/hc222ig/assignment-api-design.git
   cd movie-api
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Setup environment Create a .env file at the root and add the following:**
   ```bash
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/movie-mongo
   JWT_SECRET=your_jwt_secret
    ```
4. **Run the server**
    ```bash
    npm start
    ```

## Seed Data
    ```bash
    npm run seed
    ```

## API Endpoints
### Auth
- POST /api/users/register – Register new user
- POST /api/users/login – Login and receive JWT
### Movies
- GET /api/movies
- GET /api/movies/:id
- POST /api/movies (auth required)
- PUT /api/movies/:id (auth required)
- DELETE /api/movies/:id (auth required)
- GET /api/movies/:id/ratings
### Ratings
- GET /api/ratings
### Actors
- GET /api/actors

- All responses include HATEOAS links for easy navigation.

## Postman Testing
- MovieDatabaseAPI.postman_collection.json
- example.postman_environment.json
- Run tests using Newman:
    ```bash
    newman run MovieDatabaseAPI.postman_collection.json -e example.postman_environment.json
    ```

## Swagger Documentation
- Access the Swagger UI at `http://localhost:3000/api-docs`

## Author
- Hao Chen

## License
- This project is licensed under the MIT License.
```

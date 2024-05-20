# Tech Trivia API

This API allows you to manage a collection of multiple-choice quiz questions. The API includes endpoints to get, add, update, and delete quiz items, as well as search for quiz items by tags.

## Table of Contents

- [Tech Trivia API](#tech-trivia-api)
  - [Table of Contents](#table-of-contents)
  - [Environment Variables](#environment-variables)
  - [Routes](#routes)
    - [GET /quiz](#get-quiz)
    - [GET /quiz/random](#get-quizrandom)
    - [GET /quiz/search](#get-quizsearch)
    - [GET /quiz/:id](#get-quizid)
    - [POST /quiz](#post-quiz)
    - [PUT /quiz/:id](#put-quizid)
    - [DELETE /quiz/:id](#delete-quizid)
  - [Authentication Middleware](#authentication-middleware)
  - [Validation Middleware](#validation-middleware)
  - [Installation](#installation)
  - [Usage](#usage)

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
DATABASE_URL=mongodb://localhost:27017
PASS_HASH=your_secure_password
PORT=3000
```

- `DATABASE_URL`: The URL of your MongoDB database.
- `PASS_HASH`: The password to authenticate certain routes.
- `PORT`: The port on which the server runs (default is 3000).

## Routes

### GET /quiz

Retrieve a paginated list of quiz items.

- **Query Parameters:**
  - `limit` (optional, default: 10): The number of quiz items to retrieve per page.
  - `page` (optional, default: 1): The page number to retrieve.
- **Response:**
  - `200 OK`: A paginated list of quiz items.
  - `404 Not Found`: No quiz items found.
  - `400 Bad Request`: Invalid query parameters.
  - `500 Internal Server Error`: An error occurred on the server.

### GET /quiz/random

Retrieve a random quiz item.

- **Response:**
  - `200 OK`: A random quiz item.
  - `404 Not Found`: No quiz items found.
  - `500 Internal Server Error`: An error occurred on the server.

### GET /quiz/search

Search for quiz items by title or options.

- **Query Parameters:**
  - `q` (required): The search term.
  - `limit` (optional, default: 10): The number of quiz items to retrieve per page.
  - `page` (optional, default: 1): The page number to retrieve.
- **Response:**
  - `200 OK`: A paginated list of matching quiz items.
  - `404 Not Found`: No matching quiz items found.
  - `400 Bad Request`: Invalid query parameters.
  - `500 Internal Server Error`: An error occurred on the server.

### GET /quiz/:id

Retrieve a specific quiz item by ID.

- **Parameters:**
  - `id` (required): The ID of the quiz item to retrieve.
- **Response:**
  - `200 OK`: The requested quiz item.
  - `404 Not Found`: Quiz item not found.
  - `500 Internal Server Error`: An error occurred on the server.

### POST /quiz

Add a new quiz item. Requires authentication.

- **Body Parameters:**
  - `title` (required): The title of the quiz item.
  - `options` (required): An array of options for the quiz item (minimum 2).
  - `correct` (required): The correct answer (must be one of the options).
- **Response:**
  - `201 Created`: The created quiz item.
  - `400 Bad Request`: Invalid or missing body parameters.
  - `401 Unauthorized`: Authentication failure.
  - `500 Internal Server Error`: An error occurred on the server.

### PUT /quiz/:id

Update a specific quiz item by ID. Requires authentication.

- **Parameters:**
  - `id` (required): The ID of the quiz item to update.
- **Body Parameters:**
  - Any fields to update (`title`, `options`, `correct`).
- **Response:**
  - `200 OK`: The updated quiz item.
  - `404 Not Found`: Quiz item not found.
  - `401 Unauthorized`: Authentication failure.
  - `500 Internal Server Error`: An error occurred on the server.

### DELETE /quiz/:id

Delete a specific quiz item by ID. Requires authentication.

- **Parameters:**
  - `id` (required): The ID of the quiz item to delete.
- **Response:**
  - `200 OK`: Confirmation of deletion.
  - `404 Not Found`: Quiz item not found.
  - `401 Unauthorized`: Authentication failure.
  - `500 Internal Server Error`: An error occurred on the server.

## Authentication Middleware

Some routes require authentication. The middleware checks for a query parameter `pass` and validates it against the `PASS_HASH` environment variable.

## Validation Middleware

The `validateQuizFields` middleware checks that the required fields (`title`, `options`, `correct`) are present and correctly formatted in the request body before inserting a new quiz item.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/arpitnema07/tech-trivia.git
   cd tech-trivia
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file with your environment variables.

4. Seed the database with initial data if necessary.

## Usage

Start the server:

```sh
npm start
```

The server will be running on `http://localhost:3000`.

Use the provided routes to interact with the quiz API.

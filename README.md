# Tech Trivia API

This Express application connects to a MongoDB database and provides an API to fetch a random quiz item from the collection.

## API Routes

### Get a Random Quiz Item

#### Endpoint

```

GET /quiz

```

#### Description

Fetches a random quiz item from the MongoDB collection.

#### Response

- **200 OK**: Returns a random quiz item in JSON format.
- **404 Not Found**: If there are no documents in the collection.
- **500 Internal Server Error**: If there is an error retrieving the quiz item.

#### Example Response

```json
{
  "question": "What is the capital of France?",
  "options": ["Berlin", "Madrid", "Paris", "Rome"],
  "answer": "Paris"
}
```

## Setup and Configuration

1. **Environment Variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL=mongodb://localhost:27017
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Server**

   ```bash
   node app.js
   ```

   The server will start on port 3000.

## Middleware

- **express.json()**: Parses incoming JSON requests and puts the parsed data in `req.body`.

## Error Handling

The API handles errors gracefully and returns appropriate HTTP status codes with error messages.

## License

This project is licensed under the ISC License.

const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// MongoDB connection URL and database/collection names
const url = process.env.DATABASE_URL;
const dbName = "tech_trivia";
const collectionName = "mcq";

// Create a new Express application
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create a new MongoClient
const client = new MongoClient(url);

// Route to get a random quiz item
app.get("/quiz", async (req, res) => {
  try {
    // Connect to the MongoDB server
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Get the count of documents in the collection
    const count = await collection.countDocuments();

    if (count === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);

    // Retrieve the random document
    const randomDocument = await collection
      .find()
      .limit(1)
      .skip(randomIndex)
      .next();

    res.json(randomDocument);
  } catch (err) {
    console.error("Error retrieving quiz item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Optionally, close the connection after each request
    // await client.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

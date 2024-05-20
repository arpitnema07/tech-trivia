import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import { checkPass } from "./authMiddleware.js";
import { validateQuizFields } from "./validationMiddleware.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const db = await connectDB();
const collection = db.collection("mcq");

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/quiz", async (req, res) => {
  try {
    // Get the count of documents in the collection
    const count = await collection.countDocuments();

    if (count === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    // Get query parameters for limit and page, with defaults
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
      return res
        .status(400)
        .json({ error: "Limit and page must be positive integers" });
    }

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    if (skip >= count) {
      return res.status(404).json({ error: "Page number out of range" });
    }

    // Retrieve the documents for the specified page
    const documents = await collection
      .find({}, { projection: { id: 0 } })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      page: page,
      limit: limit,
      totalDocuments: count,
      totalPages: Math.ceil(count / limit),
      documents: documents,
    });
  } catch (err) {
    console.error("Error retrieving quiz items:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/quiz", checkPass, validateQuizFields, async (req, res) => {
  try {
    const newQuizItem = req.body;

    const result = await collection.insertOne(newQuizItem);

    res.status(201).json(result.ops[0]);
  } catch (err) {
    console.error("Error adding new quiz item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/quiz/search", async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
      return res
        .status(400)
        .json({ error: "Limit and page must be positive integers" });
    }

    const skip = (page - 1) * limit;

    const count = await collection.countDocuments({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { options: { $elemMatch: { $regex: searchTerm, $options: "i" } } },
      ],
    });

    if (count === 0) {
      return res
        .status(404)
        .json({ error: "No quiz items found with the specified tag" });
    }

    if (skip >= count) {
      return res.status(404).json({ error: "Page number out of range" });
    }

    const documents = await collection
      .find(
        {
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { options: { $elemMatch: { $regex: searchTerm, $options: "i" } } },
          ],
        },
        { projection: { id: 0 } }
      )
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      page: page,
      limit: limit,
      totalDocuments: count,
      totalPages: Math.ceil(count / limit),
      documents: documents,
    });
  } catch (err) {
    console.error("Error retrieving quiz items by tag:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/quiz/random", async (req, res) => {
  try {
    // Get the count of documents in the collection
    const count = await collection.countDocuments();

    if (count === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);

    // Retrieve the random document
    const randomDocument = await collection
      .find({}, { projection: { id: 0 } })
      .skip(randomIndex)
      .limit(1)
      .next();

    res.json(randomDocument);
  } catch (err) {
    console.error("Error retrieving random quiz item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/quiz/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const quizItem = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { id: 0 } }
    );

    if (!quizItem) {
      return res.status(404).json({ error: "Quiz item not found" });
    }

    res.json(quizItem);
  } catch (err) {
    console.error("Error retrieving quiz item by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/quiz/:id", checkPass, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Quiz item not found" });
    }

    const updatedQuizItem = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 0 } }
    );

    res.json(updatedQuizItem);
  } catch (err) {
    console.error("Error updating quiz item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/quiz/:id", checkPass, async (req, res) => {
  try {
    const id = req.params.id;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Quiz item not found" });
    }

    res.json({ message: "Quiz item deleted successfully" });
  } catch (err) {
    console.error("Error deleting quiz item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

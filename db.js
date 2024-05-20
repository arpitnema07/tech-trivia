import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DATABASE_URL;
const dbName = "tech_trivia";

let client;
let db;

export async function connectDB() {
  if (db) return db;
  client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export async function disconnectDB() {
  if (client) {
    await client.close();
    db = null;
    client = null;
  }
}

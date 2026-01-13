import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB path
const dbPath = path.join(__dirname, "../../database.sqlite");

// Connect DB
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ DB connection error:", err.message);
  } else {
    console.log("✅ SQLite database connected");
  }
});

export default db;

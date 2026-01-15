import db from "../config/db.js";
import { isValidPassword } from "../utils/validators.js";

// 📋 Get All Stores (with search + user rating)
export const updatePassword = (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Both passwords required" });
  }

  if (!isValidPassword(newPassword)) {
    return res.status(400).json({
      message: "Password must be 8–16 chars, include uppercase & special char",
    });
  }

  const query = `SELECT * FROM users WHERE id = ?`;

  db.get(query, [userId], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const updateQuery = `UPDATE users SET password = ? WHERE id = ?`;

    db.run(updateQuery, [hashedPassword, userId], function (err) {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "Password updated successfully" });
    });
  });
};


export const getAllStores = (req, res) => {
  const userId = req.user.id;
  const { name, address, sortBy = "name", order = "ASC" } = req.query;

  const allowedSort = ["name", "address", "overallRating"];
  const safeSort = allowedSort.includes(sortBy) ? sortBy : "name";
  const safeOrder = order === "DESC" ? "DESC" : "ASC";

  let query = `
    SELECT 
      stores.id,
      stores.name,
      stores.address,
      IFNULL(AVG(ratings.rating), 0) AS overallRating,
      (
        SELECT rating 
        FROM ratings 
        WHERE ratings.store_id = stores.id 
        AND ratings.user_id = ?
      ) AS userRating
    FROM stores
    LEFT JOIN ratings ON stores.id = ratings.store_id
    WHERE 1=1
  `;

  const params = [userId];

  if (name) {
    query += ` AND stores.name LIKE ?`;
    params.push(`%${name}%`);
  }

  if (address) {
    query += ` AND stores.address LIKE ?`;
    params.push(`%${address}%`);
  }

  query += ` GROUP BY stores.id ORDER BY ${safeSort} ${safeOrder}`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
};

// ⭐ Submit or Update Rating
export const submitRating = (req, res) => {
  const userId = req.user.id;
  const { store_id, rating } = req.body;

  if (!store_id || rating === undefined) {
    return res.status(400).json({ message: "Store ID and rating required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const checkQuery = `
    SELECT id FROM ratings 
    WHERE user_id = ? AND store_id = ?
  `;

  db.get(checkQuery, [userId, store_id], (err, row) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (row) {
      // Update rating
      const updateQuery = `
        UPDATE ratings 
        SET rating = ?, created_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND store_id = ?
      `;

      db.run(updateQuery, [rating, userId, store_id], function (err) {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Rating updated successfully" });
      });
    } else {
      // Insert new
      const insertQuery = `
        INSERT INTO ratings (user_id, store_id, rating)
        VALUES (?, ?, ?)
      `;

      db.run(insertQuery, [userId, store_id, rating], function (err) {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Rating submitted successfully" });
      });
    }
  });
};



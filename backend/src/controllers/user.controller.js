import db from "../config/db.js";

// 📋 Get All Stores (with search + user rating)
export const getAllStores = (req, res) => {
  const userId = req.user.id;
  const { name, address } = req.query;

  let query = `
    SELECT 
      stores.id,
      stores.name,
      stores.address,
      IFNULL(AVG(ratings.rating), 0) as overallRating,
      (
        SELECT rating 
        FROM ratings 
        WHERE ratings.store_id = stores.id 
        AND ratings.user_id = ?
      ) as userRating
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

  query += ` GROUP BY stores.id`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// ⭐ Submit or Update Rating
export const submitRating = (req, res) => {
  const userId = req.user.id;
  const { store_id, rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const checkQuery = `
    SELECT * FROM ratings WHERE user_id = ? AND store_id = ?
  `;

  db.get(checkQuery, [userId, store_id], (err, row) => {
    if (row) {
      // Update rating
      const updateQuery = `
        UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?
      `;

      db.run(updateQuery, [rating, userId, store_id], function (err) {
        if (err) return res.status(500).json(err);
        res.json({ message: "Rating updated successfully" });
      });
    } else {
      // Insert new rating
      const insertQuery = `
        INSERT INTO ratings (user_id, store_id, rating)
        VALUES (?, ?, ?)
      `;

      db.run(insertQuery, [userId, store_id, rating], function (err) {
        if (err) return res.status(500).json(err);
        res.json({ message: "Rating submitted successfully" });
      });
    }
  });
};

import db from "../config/db.js";

export const getOwnerDashboard = (req, res) => {
  try {
    console.log("getOwnerDashboard called");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    const ownerId = req.user.id;
    console.log("Owner ID:", ownerId);

    // Fetch the store for this owner
    const storeQuery = `
      SELECT 
        stores.id,
        stores.name,
        stores.address,
        IFNULL(AVG(ratings.rating), 0) AS averageRating
      FROM stores
      LEFT JOIN ratings ON stores.id = ratings.store_id
      WHERE stores.owner_id = ?
      GROUP BY stores.id
      LIMIT 1
    `;

    db.get(storeQuery, [ownerId], (err, store) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // No store for this owner
      if (!store) {
        return res.json({ store: null, ratings: [] });
      }

      // Fetch ratings for this store
      const ratingsQuery = `
        SELECT 
          users.name AS user_name,
          ratings.rating,
          ratings.created_at
        FROM ratings
        JOIN users ON ratings.user_id = users.id
        WHERE ratings.store_id = ?
        ORDER BY ratings.created_at DESC
      `;

      db.all(ratingsQuery, [store.id], (err, ratings) => {
        if (err) {
          console.error("DB error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        // Return store and ratings
        res.json({
          store,
          ratings,
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

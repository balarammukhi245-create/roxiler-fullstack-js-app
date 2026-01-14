import db from "../config/db.js";

// 🏪 Get Owner Dashboard
export const getOwnerDashboard = (req, res) => {
  try {
    console.log("getOwnerDashboard called");

    // Make sure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    const ownerId = req.user.id; // extracted from token
    console.log("Owner ID:", ownerId);

    // Query the store owned by this owner
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
    `;

    db.get(storeQuery, [ownerId], (err, store) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (!store) {
        return res.status(404).json({ message: "No store found for this owner" });
      }

      // Query ratings for this store
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
          console.error(err);
          return res.status(500).json({ message: "Database error", error: err });
        }

        // Respond with store info + ratings
        res.json({
          store,
          ratings,
        });
      });
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error", error });
    }
  }
};

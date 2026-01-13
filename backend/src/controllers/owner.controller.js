import db from "../config/db.js";

// 🏪 Get Owner Dashboard
export const getOwnerDashboard = (req, res) => {
  const ownerId = req.user.id;

  const storeQuery = `
    SELECT 
      stores.id,
      stores.name,
      stores.address,
      IFNULL(AVG(ratings.rating), 0) as averageRating
    FROM stores
    LEFT JOIN ratings ON stores.id = ratings.store_id
    WHERE stores.owner_id = ?
    GROUP BY stores.id
  `;

  db.get(storeQuery, [ownerId], (err, store) => {
    if (err) return res.status(500).json(err);
    if (!store) return res.status(404).json({ message: "Store not found" });

    const usersQuery = `
      SELECT 
        users.id,
        users.name,
        users.email,
        ratings.rating
      FROM ratings
      JOIN users ON ratings.user_id = users.id
      WHERE ratings.store_id = ?
    `;

    db.all(usersQuery, [store.id], (err, users) => {
      if (err) return res.status(500).json(err);

      res.json({
        store,
        users
      });
    });
  });
};

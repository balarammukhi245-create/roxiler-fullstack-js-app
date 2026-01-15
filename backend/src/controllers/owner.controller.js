import db from "../config/db.js";
import bcrypt from "bcrypt";

export const getOwnerDashboard = (req, res) => {
  try {
    if (!req.user || req.user.role !== "owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const ownerId = req.user.id;

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

      if (!store) {
        return res.json({
          store: null,
          ratings: []
        });
      }

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

        return res.json({
          store: {
            id: store.id,
            name: store.name,
            address: store.address,
            averageRating: Number(store.averageRating)
          },
          ratings: ratings || []
        });
      });
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateOwnerPassword = (req, res) => {
  const ownerId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old and new password required" });
  }

  // Password validation (8-16, uppercase, special)
  const pwdRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
  if (!pwdRegex.test(newPassword)) {
    return res.status(400).json({
      message: "Password must be 8-16 chars, include uppercase & special char"
    });
  }

  const query = `SELECT password FROM users WHERE id = ? AND role='owner'`;

  db.get(query, [ownerId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.run(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, ownerId],
      function (err) {
        if (err) return res.status(500).json({ message: "DB error" });
        res.json({ message: "Password updated successfully" });
      }
    );
  });
};
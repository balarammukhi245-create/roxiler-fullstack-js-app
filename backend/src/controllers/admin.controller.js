import db from "../config/db.js";

// 📊 Dashboard Stats
export const getDashboardStats = (req, res) => {
  const stats = {};

  db.get(`SELECT COUNT(*) as totalUsers FROM users`, [], (err, row) => {
    if (err) return res.status(500).json(err);
    stats.totalUsers = row.totalUsers;

    db.get(`SELECT COUNT(*) as totalStores FROM stores`, [], (err, row) => {
      if (err) return res.status(500).json(err);
      stats.totalStores = row.totalStores;

      db.get(`SELECT COUNT(*) as totalRatings FROM ratings`, [], (err, row) => {
        if (err) return res.status(500).json(err);
        stats.totalRatings = row.totalRatings;

        res.json(stats);
      });
    });
  });
};

// ➕ Add User (Admin can add any role)
export const addUser = (req, res) => {
  const { name, email, password, address, role } = req.body;

  const query = `
    INSERT INTO users (name, email, password, address, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, password, address, role], function (err) {
    if (err) return res.status(400).json({ message: err.message });

    res.status(201).json({ message: "User added successfully" });
  });
};

// ➕ Add Store
export const addStore = (req, res) => {
  const { name, email, address, owner_id } = req.body;

  const query = `
    INSERT INTO stores (name, email, address, owner_id)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [name, email, address, owner_id], function (err) {
    if (err) return res.status(400).json({ message: err.message });

    res.status(201).json({ message: "Store added successfully" });
  });
};

// 📋 List Users
export const listUsers = (req, res) => {
  const { name, email, address, role, sortBy = "name", order = "ASC" } = req.query;

  let query = `SELECT id, name, email, address, role FROM users WHERE 1=1`;
  const params = [];

  if (name) {
    query += ` AND name LIKE ?`;
    params.push(`%${name}%`);
  }

  if (email) {
    query += ` AND email LIKE ?`;
    params.push(`%${email}%`);
  }

  if (address) {
    query += ` AND address LIKE ?`;
    params.push(`%${address}%`);
  }

  if (role) {
    query += ` AND role = ?`;
    params.push(role);
  }

  query += ` ORDER BY ${sortBy} ${order}`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};


// 🏪 List Stores + Avg Rating
export const listStores = (req, res) => {
  const { name, email, address, sortBy = "name", order = "ASC" } = req.query;

  let query = `
    SELECT 
      stores.id,
      stores.name,
      stores.email,
      stores.address,
      IFNULL(AVG(ratings.rating), 0) as rating
    FROM stores
    LEFT JOIN ratings ON stores.id = ratings.store_id
    WHERE 1=1
  `;

  const params = [];

  if (name) {
    query += ` AND stores.name LIKE ?`;
    params.push(`%${name}%`);
  }

  if (email) {
    query += ` AND stores.email LIKE ?`;
    params.push(`%${email}%`);
  }

  if (address) {
    query += ` AND stores.address LIKE ?`;
    params.push(`%${address}%`);
  }

  query += ` GROUP BY stores.id ORDER BY ${sortBy} ${order}`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
 

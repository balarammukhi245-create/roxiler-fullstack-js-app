import bcrypt from "bcrypt";
import db from "../config/db.js";
import { isValidEmail, isValidPassword, isValidName, isValidAddress } from "../utils/validators.js";


//  Dashboard Stats
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

//adding user
export const addUser = (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (!isValidName(name)) {
    return res.status(400).json({ message: "Name must be 20–60 characters" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: "Password must be 8–16 chars, include 1 uppercase & 1 special char",
    });
  }

  if (!isValidAddress(address)) {
    return res.status(400).json({ message: "Address max 400 chars" });
  }

  const allowedRoles = ["admin", "user", "owner"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO users (name, email, password, address, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, hashedPassword, address, role], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({ message: "User created successfully" });
  });
};


//adding store
export const addStore = (req, res) => {
  const { name, email, address, owner_id } = req.body;

  if (!name || !email || !owner_id) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  if (!isValidName(name)) {
    return res.status(400).json({ message: "Name must be 20–60 characters" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!isValidAddress(address)) {
    return res.status(400).json({ message: "Address max 400 chars" });
  }

  const query = `
    INSERT INTO stores (name, email, address, owner_id)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [name, email, address, owner_id], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ message: "Store email already exists" });
      }
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({ message: "Store added successfully" });
  });
};

//list of users

export const listUsers = (req, res) => {
  const { name, email, address, role, sortBy = "name", order = "ASC" } = req.query;

  const allowedSort = ["name", "email", "address", "role"];
  const safeSort = allowedSort.includes(sortBy) ? sortBy : "name";
  const safeOrder = order === "DESC" ? "DESC" : "ASC";

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

  query += ` ORDER BY ${safeSort} ${safeOrder}`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
};

//list of stors 

export const listStores = (req, res) => {
  const { name, email, address, sortBy = "name", order = "ASC" } = req.query;

  const allowedSort = ["name", "email", "address", "rating"];
  const safeSort = allowedSort.includes(sortBy) ? sortBy : "name";
  const safeOrder = order === "DESC" ? "DESC" : "ASC";

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

  query += ` GROUP BY stores.id ORDER BY ${safeSort} ${safeOrder}`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
};


//getting the details of user and owner

export const getUserDetails = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT id, name, email, address, role 
    FROM users WHERE id = ?
  `;

  db.get(query, [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "owner") {
      const ratingQuery = `
        SELECT IFNULL(AVG(ratings.rating), 0) as rating
        FROM stores
        LEFT JOIN ratings ON stores.id = ratings.store_id
        WHERE stores.owner_id = ?
      `;

      db.get(ratingQuery, [userId], (err, row) => {
        if (err) return res.status(500).json({ message: "Database error" });

        user.rating = row.rating;
        res.json(user);
      });
    } else {
      res.json(user);
    }
  });
};

export const getAdminRatings = (req, res) => {
  const { store_name, user_name } = req.query;

  let query = `
    SELECT ratings.id, ratings.rating, ratings.created_at,
           stores.name AS store_name,
           users.name AS user_name
    FROM ratings
    LEFT JOIN stores ON ratings.store_id = stores.id
    LEFT JOIN users ON ratings.user_id = users.id
    WHERE 1=1
  `;
  const params = [];

  if (store_name) {
    query += ` AND stores.name LIKE ?`;
    params.push(`%${store_name}%`);
  }

  if (user_name) {
    query += ` AND users.name LIKE ?`;
    params.push(`%${user_name}%`);
  }

  query += ` ORDER BY ratings.created_at DESC`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    res.json(rows);
  });
};

import { isValidEmail, isValidPassword, isValidName, isValidAddress } from "../utils/validators.js";
import bcrypt from "bcrypt";
import db from "../config/db.js";


export const updatePassword = (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (!isValidPassword(newPassword)) {
    return res.status(400).json({
      message: "Password must be 8–16 chars, include 1 uppercase & 1 special character",
    });
  }

  const query = `SELECT * FROM users WHERE id = ?`;

  db.get(query, [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const updateQuery = `UPDATE users SET password = ? WHERE id = ?`;

    db.run(updateQuery, [hashedPassword, userId], function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Password updated successfully" });
    });
  });
};


export const signup = (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (!isValidName(name)) {
    return res.status(400).json({ message: "Name must be 20-60 characters" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: "Password must be 8–16 chars, include 1 uppercase & 1 special character",
    });
  }

  if (!isValidAddress(address)) {
    return res.status(400).json({ message: "Address max 400 characters" });
  }

  const allowedRoles = ["user", "admin", "owner"];
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

    res.status(201).json({ message: `${role} registered successfully` });
  });
};

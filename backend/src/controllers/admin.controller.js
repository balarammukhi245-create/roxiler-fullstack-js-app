import bcrypt from "bcrypt";
import db from "../config/db.js";
import { isValidEmail, isValidPassword, isValidName, isValidAddress } from "../utils/validators.js";

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

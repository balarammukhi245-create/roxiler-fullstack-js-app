import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// UPDATE PASSWORD
export const updatePassword = (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

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
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      res.json({ message: "Password updated successfully" });
    });
  });
};



// SIGNUP (Normal User)
export const signup = (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO users (name, email, password, address, role)
    VALUES (?, ?, ?, ?, 'user')
  `;

  db.run(query, [name, email, hashedPassword, address], function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
};

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  });
};

import db from "./config/db.js";
import bcrypt from "bcryptjs";

const seedDB = async () => {
  try {
    // -----------------------------
    // 1️⃣ USERS (admin + owners + users)
    // -----------------------------
    const passwordHash = await bcrypt.hash("123456", 10);

    const users = [
      { name: "Admin", email: "admin@demo.com", password: passwordHash, address: "HQ Address", role: "admin" },
      { name: "Owner One", email: "owner1@demo.com", password: passwordHash, address: "Owner Address 1", role: "owner" },
      { name: "Owner Two", email: "owner2@demo.com", password: passwordHash, address: "Owner Address 2", role: "owner" },
      { name: "Rahul Babu", email: "rahulyadav11@gmail.com", password: passwordHash, address: "hvbhgvgdxc", role: "user" },
      { name: "John Doe", email: "john@demo.com", password: passwordHash, address: "Some Address", role: "user" }
    ];

    for (const user of users) {
      db.run(
        "INSERT OR IGNORE INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
        [user.name, user.email, user.password, user.address, user.role],
        (err) => {
          if (err) console.log("User insert error:", err.message);
        }
      );
    }

    // -----------------------------
    // 2️⃣ STORES (owned by owners)
    // -----------------------------
    const stores = [
      { name: "Coffee Hub", email: "coffee@hub.com", address: "MG Road", ownerEmail: "owner1@demo.com" },
      { name: "Pizza Planet", email: "pizza@planet.com", address: "Sector 21", ownerEmail: "owner1@demo.com" },
      { name: "Techies Electronics", email: "tech@electronics.com", address: "IT Park", ownerEmail: "owner2@demo.com" },
      { name: "Bookworm Paradise", email: "books@paradise.com", address: "Downtown", ownerEmail: "owner2@demo.com" }
    ];

    for (const store of stores) {
      // Get owner_id
      db.get("SELECT id FROM users WHERE email = ?", [store.ownerEmail], (err, row) => {
        if (err) return console.log("Owner fetch error:", err.message);
        const ownerId = row?.id || null;

        db.run(
          "INSERT OR IGNORE INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
          [store.name, store.email, store.address, ownerId],
          (err) => {
            if (err) console.log("Store insert error:", err.message);
          }
        );
      });
    }

    // -----------------------------
    // 3️⃣ RATINGS (from users)
    // -----------------------------
    const ratings = [
      { userEmail: "rahulyadav11@gmail.com", storeEmail: "coffee@hub.com", rating: 4 },
      { userEmail: "rahulyadav11@gmail.com", storeEmail: "pizza@planet.com", rating: 5 },
      { userEmail: "john@demo.com", storeEmail: "tech@electronics.com", rating: 3 },
      { userEmail: "john@demo.com", storeEmail: "books@paradise.com", rating: 5 }
    ];

    for (const rate of ratings) {
      db.get("SELECT id FROM users WHERE email = ?", [rate.userEmail], (err, userRow) => {
        if (err) return console.log("Rating user fetch error:", err.message);
        const userId = userRow?.id;

        db.get("SELECT id FROM stores WHERE email = ?", [rate.storeEmail], (err, storeRow) => {
          if (err) return console.log("Rating store fetch error:", err.message);
          const storeId = storeRow?.id;

          if (userId && storeId) {
            db.run(
              "INSERT OR IGNORE INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
              [userId, storeId, rate.rating],
              (err) => {
                if (err) console.log("Rating insert error:", err.message);
              }
            );
          }
        });
      });
    }

    console.log("✅ Demo data seeded successfully!");
  } catch (error) {
    console.log("Seeder error:", error.message);
  }
};

seedDB();

const express = require("express");
const router = express.Router();
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/admin");
const db = require("../connection/db");
const response = require("../../respons");

const secretKey = config.secretKey;

const User = { username: "Admin", password: "Admin" };

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Gantilah ini dengan validasi pengguna dari database
  //   const user = await User.findOne({ username });

  if (User.password != password && User.username != username) {
    return res.status(401).json({ message: "Autentikasi gagal" });
  }

  const token = jwt.sign({ username: User.username }, secretKey, { expiresIn: "1h" });

  res.json({ token });
});

router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Halaman Admin terproteksi" });
});

router.get("/user", (req, res) => {
  db.query("SELECT * from user", (error, results) => {
    if (error) {
      console.error("Error fetching user", error.message);
      response(500, { message: "Internal Server Error" }, "Failed fetching data user", res);
    } else {
      response(200, results, "Successfully Updating data user", res);
    }
  });
});

router.get("/inventory", (req, res) => {
  db.query("SELECT * from produk", (error, results) => {
    if (error) {
      console.error("Error fetching produk", error.message);
      response(500, { message: "Internal Server Error" }, "Failed fetching data produk", res);
    } else {
      const page = parseInt(req.query.page) || 1;
      const totalPages = Math.ceil(results.length / config.itemPerPage);

      // console.log(results.length);
      // console.log(`Page requested: ${page}`);
      // console.log(`Page requested: ${typeof page}`);
      // console.log(`Total Pages: ${totalPages}`);

      response(200, results, "Successfully Updating data produk", res, page, totalPages, "/api/admin/inventory");
    }
  });
});

router.post("/inventory", (req, res) => {
  const { name, price, category, detail } = req.body;
  const rating = 0;
  db.query(`INSERT INTO produk (name, price, category, detail) VALUES (?, ?, ?, ?, ?, ?)`, [name, price, category, detail, rating], (error) => {
    if (error) {
      console.error("Error creating product :", error.message);
      response(500, { message: "Internal Server Error" }, "Failed Adding data products", res);
    } else {
      response(200, { message: "ok mantap" }, "Successfully Adding data products", res);
    }
  });
});

module.exports = router;

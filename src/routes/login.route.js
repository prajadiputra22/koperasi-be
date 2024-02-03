const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  try {
    const { username, password } = req.body;
    res.json({ username, password });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

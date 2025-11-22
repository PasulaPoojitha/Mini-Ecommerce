const express = require("express");
const router = express.Router();

// Correct import — MUST MATCH EXACT EXPORT NAMES
const {
  createProduct,
  getProducts
} = require("../controllers/productController");

// POST → Create product
router.post("/", createProduct);

// GET → Get all products (with pagination)
router.get("/", getProducts);

module.exports = router;

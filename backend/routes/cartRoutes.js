const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Cart = require("../models/cartModel");

// -------------------------------------
// 1️⃣ GET ALL CARTS (must be FIRST)
// -------------------------------------
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    return res.json(carts);
  } catch (err) {
    console.error("Get all carts error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// -------------------------------------
// 2️⃣ SAVE CART
// -------------------------------------
router.post("/save", async (req, res) => {
  try {
    const { userId, items } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = items;
    } else {
      cart = new Cart({ userId, items });
    }

    await cart.save();
    return res.json({ success: true, cart });
  } catch (err) {
    console.error("Save cart error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// -------------------------------------
// 3️⃣ UPDATE SINGLE ITEM
// -------------------------------------
router.put("/item", async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;
    if (!userId || !productId)
      return res.status(400).json({ error: "Missing fields" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const index = cart.items.findIndex((i) => i.productId === productId);
    if (index === -1)
      return res.status(404).json({ error: "Item not in cart" });

    cart.items[index].qty = qty;
    if (qty <= 0) cart.items.splice(index, 1);

    await cart.save();
    return res.json({ success: true, cart });
  } catch (err) {
    console.error("Update item error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// -------------------------------------
// 4️⃣ DELETE CART BY USER ID
// -------------------------------------
router.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    await Cart.deleteOne({ userId });
    return res.json({ success: true });
  } catch (err) {
    console.error("Delete cart error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// -------------------------------------
// 5️⃣ GET CART BY USER ID (must be LAST)
// -------------------------------------
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ items: [] });
    return res.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

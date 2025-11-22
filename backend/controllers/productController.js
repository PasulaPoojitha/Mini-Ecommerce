const Product = require("../models/productModel");

// CREATE PRODUCT (Fix added)
exports.createProduct = async (req, res) => {
  try {
    const { name, desc, price, img } = req.body;

    if (!name || !desc || !price || !img) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      name,
      desc,
      price,
      img
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET PRODUCTS (pagination working)
exports.getProducts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

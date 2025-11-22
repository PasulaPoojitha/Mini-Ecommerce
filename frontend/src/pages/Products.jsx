import "./Products.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { saveCartToServer, getCartFromServer } from "../utils/cartApi";

const USER_ID = localStorage.getItem("userEmail");


function Products() {
  const [products, setProducts] = useState([]);
  const [cartMap, setCartMap] = useState({}); // store qty by productId

  // Load products
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/products")
      .then((res) => setProducts(res.data.products || []))
      .catch((err) => console.log(err));
  }, []);

  // Load cart from backend
  useEffect(() => {
    (async () => {
      const data = await getCartFromServer(USER_ID);
      const items = data.items || [];

      const temp = {};
      items.forEach((it) => {
        temp[it.productId] = it.qty;
      });

      setCartMap(temp);
    })();
  }, []);

  return (
    <div className="products-container">
      <h1 className="menu-title">Our Products</h1>

      <div className="products-grid">
        {products.map((item) => (
          <ProductCard
            key={item._id}
            item={item}
            qty={cartMap[item._id] || 0}
            setCartMap={setCartMap}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ item, qty, setCartMap }) {
  const numericPrice = Number(String(item.price).replace(/[^0-9.-]+/g, ""));

  const persistCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    saveCartToServer(USER_ID, cart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((c) => c.productId === item._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        productId: item._id,
        name: item.name,
        desc: item.desc, // ⭐ FIXED: add description
        price: numericPrice,
        img: item.img,
        qty: 1,
      });
    }

    setCartMap((prev) => ({
      ...prev,
      [item._id]: (prev[item._id] || 0) + 1,
    }));

    persistCart(cart);
  };

  const decreaseQty = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((c) => c.productId === item._id);
    if (!existing) return;

    if (existing.qty > 1) {
      existing.qty -= 1;
    } else {
      const index = cart.findIndex((c) => c.productId === item._id);
      cart.splice(index, 1); // remove when qty becomes 0
    }

    setCartMap((prev) => ({
      ...prev,
      [item._id]: Math.max((prev[item._id] || 0) - 1, 0),
    }));

    persistCart(cart);
  };

  return (
    <div className="product-card">
      <img
        src={`/products/${item.img}`}
        alt={item.name}
        className="product-img"
      />

      <h3 className="product-name">{item.name}</h3>
      <p className="product-desc">{item.desc}</p>

      <div className="bottom-row">
        <span className="price">₹{numericPrice}</span>

        <div className="qty-box">
          <button onClick={decreaseQty}>-</button>
          <span>{qty}</span>
          <button onClick={increaseQty}>+</button>
        </div>
      </div>
    </div>
  );
}

export default Products;

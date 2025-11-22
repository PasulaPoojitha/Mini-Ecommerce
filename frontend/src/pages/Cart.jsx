import React, { useEffect, useState } from "react";
import "./Cart.css";
import { getCartFromServer, saveCartToServer } from "../utils/cartApi";
import { MdDeleteOutline } from "react-icons/md";

// ⭐ USE LOGGED-IN USER EMAIL
const USER_ID = localStorage.getItem("userEmail");

function Cart() {
  const [cart, setCart] = useState([]);
  const [saving, setSaving] = useState({}); 
  const [loading, setLoading] = useState(true);

  // Load cart from backend
  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await getCartFromServer(USER_ID);
      setCart(data.items || []);
      localStorage.setItem("cart", JSON.stringify(data.items || []));
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
    const updateListener = () => loadCart();
    window.addEventListener("cartUpdated", updateListener);
    return () => window.removeEventListener("cartUpdated", updateListener);
  }, []);

  // Save updated cart to backend
  const persist = async (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const res = await saveCartToServer(USER_ID, updatedCart);

    if (res && res.success) {
      setCart(updatedCart);
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      console.error("Failed to save cart");
      loadCart(); // rollback
    }
  };

  const increaseQty = async (productId) => {
    if (saving[productId]) return;
    setSaving((prev) => ({ ...prev, [productId]: true }));

    const updated = cart.map((it) =>
      it.productId === productId ? { ...it, qty: it.qty + 1 } : it
    );

    await persist(updated);
    setSaving((prev) => ({ ...prev, [productId]: false }));
  };

  const decreaseQty = async (productId) => {
    if (saving[productId]) return;
    setSaving((prev) => ({ ...prev, [productId]: true }));

    let updated = cart.map((it) =>
      it.productId === productId ? { ...it, qty: it.qty - 1 } : it
    );

    updated = updated.filter((it) => it.qty > 0);

    await persist(updated);
    setSaving((prev) => ({ ...prev, [productId]: false }));
  };

  const deleteItem = async (productId) => {
    if (saving[productId]) return;

    const updated = cart.filter((it) => it.productId !== productId);
    await persist(updated);
  };

  const subtotal = cart.reduce(
    (total, it) => total + Number(it.price) * it.qty,
    0
  );
  const discount = subtotal > 2000 ? subtotal * 0.1 : 0;
  const finalAmount = subtotal - discount;

  return (
    <div className="cart-container">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : cart.length === 0 ? (
        <p className="empty-msg">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-card" key={item.productId}>
                <img
                  src={`/products/${item.img}`}
                  alt={item.name}
                  className="cart-img"
                />

                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p className="cart-desc">{item.desc}</p>

                  <div className="qty-delete-row">
                    <div className="qty-box">
                      <button onClick={() => decreaseQty(item.productId)}>
                        –
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => increaseQty(item.productId)}>
                        +
                      </button>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => deleteItem(item.productId)}
                    >
                      <MdDeleteOutline className="delete-icon" /> Delete
                    </button>
                  </div>

                  <h3 className="price">₹{item.price}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Bill summary below items */}
          <div className="bill-box">
            <h2>Order Summary</h2>

            <div className="bill-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="bill-row">
              <span>Discount</span>
              <span>₹{discount.toFixed(2)}</span>
            </div>

            <hr />

            <div className="bill-total">
              <span>Total Amount</span>
              <span>₹{finalAmount.toFixed(2)}</span>
            </div>

            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

// src/utils/cartApi.js
export const API_BASE = "http://127.0.0.1:5000/api/cart";

// Save full cart
export async function saveCartToServer(userId, items) {
  try {
    const res = await fetch(`${API_BASE}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, items }),
    });
    return await res.json();
  } catch (err) {
    console.error("saveCartToServer err:", err);
    return null;
  }
}

// Get cart
export async function getCartFromServer(userId) {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(userId)}`);
    return await res.json();
  } catch (err) {
    console.error("getCartFromServer err:", err);
    return { items: [] };
  }
}

// Update single item qty (not used now, but good to keep)
export async function updateCartItem(userId, productId, qty) {
  try {
    const res = await fetch(`${API_BASE}/item`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, qty }),
    });
    return await res.json();
  } catch (err) {
    console.error("updateCartItem err:", err);
    return null;
  }
}

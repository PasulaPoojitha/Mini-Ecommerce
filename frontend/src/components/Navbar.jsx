import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  // 👇 Load the logged-in user's email
  const USER_ID = localStorage.getItem("userEmail");
  const USER_EMAIL = localStorage.getItem("userEmail");


  const fetchCartCount = async () => {
    if (!USER_ID) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/cart/${encodeURIComponent(USER_ID)}`
      );
      const data = await res.json();

      const items = data.items || [];
      const count = items.reduce((sum, it) => sum + (it.qty || 0), 0);

      setCartCount(count);
    } catch (err) {
      console.log("Navbar fetch error:", err);

      const local = JSON.parse(localStorage.getItem("cart")) || [];
      const count = local.reduce((s, i) => s + (i.qty || 0), 0);
      setCartCount(count);
    }
  };

  useEffect(() => {
    fetchCartCount();

    window.addEventListener("cartUpdated", fetchCartCount);
    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, []);

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="logo"
        style={{
          fontFamily: "Poppins",
          fontWeight: "700",
          fontSize: "30px",
          color: "#fff",
        }}
      >
        ElectroZone
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/products" className="nav-item">Products</Link>

        {/* CART SECTION */}
        <Link to="/cart" className="nav-item cart-wrapper">
          <FaShoppingCart className="cart-icon" />
          <span>Cart</span>
          <span className="cart-badge">{cartCount}</span>
        </Link>

        {/* PROFILE ICON */}
        <div className="profile-wrapper">

  <img
    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
    alt="profile"
    className="profile-icon"
  />

  <div className="profile-tooltip">
    <p className="email-text">{USER_EMAIL || "Not logged in"}</p>

    <button
      className="logout-btn"
      onClick={() => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        window.location.href = "/login"; // redirect
      }}
    >
      Logout
    </button>
  </div>

</div>


        <Link to="/login" className="nav-item">Login / Signup</Link>
      </div>
    </nav>
  );
}

export default Navbar;

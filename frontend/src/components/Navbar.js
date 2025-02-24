import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "1rem", background: "#333", color: "#fff" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "15px" }}>
        <li><Link to="/" style={{ color: "#fff" }}>Home</Link></li>
        <li><Link to="/manager" style={{ color: "#fff" }}>Manager Page</Link></li>
        <li><Link to="/customer" style={{ color: "#fff" }}>Customer Page</Link></li>
        <li><Link to="/other" style={{ color: "#fff" }}>Other Page</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

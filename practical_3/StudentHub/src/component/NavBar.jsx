import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;

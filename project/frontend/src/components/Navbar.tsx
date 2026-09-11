import { NavLink } from "react-router-dom";
import logo from "../assets/newLogo.svg";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img
            src={logo}
            alt="Fight Night Boxing"
            className="h-16 w-auto object-contain"
          />
        </NavLink>

        {/* Nav Links */}
        <nav>
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.href}
                  end={link.href === "/"}
                  className={({ isActive }) =>
                    `font-body text-lg uppercase tracking-widest transition-colors ${
                      isActive
                        ? "rounded-sm border border-purple px-4 py-2 text-purple"
                        : "px-4 py-2 text-text hover:text-purple"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Login Button */}
        <NavLink
          to="/login"
          className="rounded-sm bg-purple px-5 py-2 font-body text-lg uppercase tracking-widest text-text transition-colors hover:opacity-90"
        >
          Login
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;

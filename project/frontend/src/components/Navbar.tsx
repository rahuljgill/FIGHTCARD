import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import logo from "../assets/newLogo.svg";
import accountIcon from "../assets/account.svg";
import logoutIcon from "../assets/logout.svg";

import api from "../api/client";
import { useCurrentUser } from "../api/useCurrentUser";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Navbar() {
  const { data: user, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");

      queryClient.setQueryData(["user"], null);
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

        {/* Authentication */}
        {!isLoading && (
          <>
            {user ? (
              <div className="relative">
                {/* User dropdown button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 rounded-sm border border-purple/30 px-5 py-3 font-body text-lg uppercase tracking-widest text-text transition-colors hover:border-purple hover:text-purple"
                >
                  <span className="max-w-40 truncate">{user.name}</span>

                  {/* Arrow */}
                  <span
                    aria-hidden
                    className={`text-md leading-none text-purple transition-transform duration-200 ${
                      dropdownOpen ? "rotate-[-90deg]" : "rotate-90"
                    }`}
                  >
                    ›
                  </span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-sm border border-purple/40 bg-[#0a0d1c] shadow-lg">
                    {/* Account */}
                    <NavLink
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-3 font-body text-sm uppercase tracking-widest text-text transition-colors hover:bg-purple/10 hover:text-purple"
                    >
                      <span>My Account</span>

                      <img src={accountIcon} alt="" className="h-5 w-5" />
                    </NavLink>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-between px-4 py-3 font-body text-sm uppercase tracking-widest text-text transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <span>Logout</span>

                      <img src={logoutIcon} alt="" className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="rounded-sm bg-purple px-5 py-2 font-body text-lg uppercase tracking-widest text-text transition-opacity hover:opacity-90"
              >
                Login
              </NavLink>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;

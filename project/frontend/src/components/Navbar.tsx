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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");

      queryClient.setQueryData(["user"], null);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-background">
      <div className="mx-auto max-w-7xl px-6 py-4">
        {/* ==================== DESKTOP NAVBAR ==================== */}
        <div className="hidden items-center justify-between md:flex">
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

        {/* ==================== MOBILE NAVBAR ==================== */}
        <div className="flex items-center justify-between md:hidden">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img
              src={logo}
              alt="Fight Night Boxing"
              className="h-12 w-auto object-contain"
            />
          </NavLink>

          {!isLoading && (
            <>
              {user ? (
                /* ==================== LOGGED IN MOBILE ==================== */
                <div className="relative">
                  {/* Username button */}
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center gap-2 rounded-sm border border-purple/30 px-3 py-2 font-body text-sm uppercase tracking-widest text-text transition-colors hover:border-purple hover:text-purple"
                  >
                    <span className="max-w-24 truncate">{user.name}</span>

                    {/* Arrow */}
                    <span
                      aria-hidden
                      className={`text-md leading-none text-purple transition-transform duration-200 ${
                        mobileMenuOpen ? "rotate-[-90deg]" : "rotate-90"
                      }`}
                    >
                      ›
                    </span>
                  </button>

                  {/* Mobile logged-in menu */}
                  {mobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-sm border border-purple/40 bg-[#0a0d1c] shadow-lg">
                      {/* Home */}
                      <NavLink
                        to="/"
                        end
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 font-body text-sm uppercase tracking-widest transition-colors ${
                            isActive
                              ? "bg-purple/10 text-purple"
                              : "text-text hover:bg-purple/10 hover:text-purple"
                          }`
                        }
                      >
                        Home
                      </NavLink>

                      {/* About */}
                      <NavLink
                        to="/about"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 font-body text-sm uppercase tracking-widest transition-colors ${
                            isActive
                              ? "bg-purple/10 text-purple"
                              : "text-text hover:bg-purple/10 hover:text-purple"
                          }`
                        }
                      >
                        About
                      </NavLink>

                      {/* Contact */}
                      <NavLink
                        to="/contact"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 font-body text-sm uppercase tracking-widest transition-colors ${
                            isActive
                              ? "bg-purple/10 text-purple"
                              : "text-text hover:bg-purple/10 hover:text-purple"
                          }`
                        }
                      >
                        Contact
                      </NavLink>

                      {/* My Account */}
                      <NavLink
                        to="/settings"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 font-body text-sm uppercase tracking-widest transition-colors ${
                            isActive
                              ? "bg-purple/10 text-purple"
                              : "text-text hover:bg-purple/10 hover:text-purple"
                          }`
                        }
                      >
                        My Account
                      </NavLink>

                      {/* Divider */}
                      <div className="mx-4 border-t border-purple/20" />

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 font-body text-sm uppercase tracking-widest text-text transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ==================== LOGGED OUT MOBILE ==================== */
                <div className="relative">
                  {/* Hamburger button */}
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Open navigation menu"
                    className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-sm border border-purple/30 transition-colors hover:border-purple"
                  >
                    <span
                      className={`block h-0.5 w-5 bg-text transition-transform duration-200 ${
                        mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                      }`}
                    />

                    <span
                      className={`block h-0.5 w-5 bg-text transition-opacity duration-200 ${
                        mobileMenuOpen ? "opacity-0" : ""
                      }`}
                    />

                    <span
                      className={`block h-0.5 w-5 bg-text transition-transform duration-200 ${
                        mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                      }`}
                    />
                  </button>

                  {/* Mobile logged-out menu */}
                  {mobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-sm border border-purple/40 bg-[#0a0d1c] shadow-lg">
                      {/* Home */}
                      <NavLink
                        to="/"
                        end
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 font-body text-sm uppercase tracking-widest transition-colors ${
                            isActive
                              ? "bg-purple/10 text-purple"
                              : "text-text hover:bg-purple/10 hover:text-purple"
                          }`
                        }
                      >
                        Home
                      </NavLink>

                      {/* About */}
                      <NavLink
                        to="/about"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 font-body text-sm uppercase tracking-widest transition-colors ${
                            isActive
                              ? "bg-purple/10 text-purple"
                              : "text-text hover:bg-purple/10 hover:text-purple"
                          }`
                        }
                      >
                        About
                      </NavLink>

                      {/* Contact */}
                      <NavLink
                        to="/contact"
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block px-4 py-3 font-body text-sm uppercase tracking-widest transition-colors ${
                            isActive
                              ? "bg-purple/10 text-purple"
                              : "text-text hover:bg-purple/10 hover:text-purple"
                          }`
                        }
                      >
                        Contact
                      </NavLink>

                      {/* Login */}
                      <NavLink
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block px-4 py-3 font-body text-sm uppercase tracking-widest text-text transition-colors hover:bg-purple/10 hover:text-purple"
                      >
                        Login
                      </NavLink>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

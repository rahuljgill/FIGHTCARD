import { NavLink } from "react-router-dom";
import logo from "../assets/newLogo.svg";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Footer() {
  return (
    <footer className=" bg-background px-6 py-16 font-body">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 md:flex-row md:justify-center md:gap-16">
        {/* Logo */}
        <div>
          <img
            src={logo}
            alt="Fight Night Boxing"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Divider between logo and navigation */}
        <div className="hidden h-20 w-px bg-purple/20 md:block" />

        {/* Navigation */}
        <div className="text-center md:text-left">
          <h3 className="text-sm uppercase tracking-widest text-white">
            Navigation
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.href}
                  className="text-sm text-text transition-colors hover:text-purple"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider above disclaimer */}
      <div className="mx-auto mt-16 max-w-7xl border-t border-purple/20 pt-8">
        <p className="text-xs leading-relaxed text-text/70 text-center">
          This website is an independent fan-made project and is not affiliated
          with, endorsed by, or sponsored by any boxer, promoter, governing
          body, broadcaster or boxing organisation. Fighter names, event names
          and other third-party trademarks remain the property of their
          respective owners.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

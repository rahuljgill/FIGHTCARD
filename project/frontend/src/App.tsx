import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FightDetails from "./pages/FightDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Footer from "./components/Footer";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/fights/:id" element={<FightDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Logged-out users only */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Auth />} />
        </Route>

        {/* Logged-in users only */}
        <Route element={<ProtectedRoute />}>
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;

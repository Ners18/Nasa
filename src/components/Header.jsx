// Header.jsx
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-500 text-white p-4 flex items-center justify-center">
      <Link to="/Nasa" className="text-xl font-bold">
        NASA App
      </Link>
    </header>
  );
};

export default Header;

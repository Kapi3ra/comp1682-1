import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import "./headerhome.css";

const HeaderHome = ({ user }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User logged out successfully");
        navigate("/login"); // Điều hướng về trang login sau khi logout
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <header className="navbar">
      <div className="container">
        <nav className="nav">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/joblist">Jobs</Link>
            </li>
            {user && user.email === "admin@example.com" && (
              <li>
                <Link to="/manageapplications">Applications</Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="user-section">
          {user ? (
            <div className="user-dropdown">
              <span onClick={toggleDropdown}>{user.email || "User"}</span>
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <span onClick={handleLogout} className="dropdown-item">
                    Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderHome;

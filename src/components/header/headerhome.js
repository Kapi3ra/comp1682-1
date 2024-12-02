import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import "./headerhome.css";

const HeaderHome = ({ user, handleSearch }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState); // Đảm bảo logic toggle
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User logged out successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <>
      <header className="navbar">
        <div className="container">
          <nav className="nav">
            <ul className="nav-links">
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/joblist">Jobs</Link>
              </li>
              <li>
                <Link to="/statistics">Statistics</Link>
              </li>
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
      {/* Thanh tìm kiếm */}
      <div className="search-bar-container">
        <form onSubmit={onSearchSubmit} className="search-bar">
          <input
            type="text"
            placeholder="Search jobs, companies, recruiters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>
    </>
  );
};

export default HeaderHome;

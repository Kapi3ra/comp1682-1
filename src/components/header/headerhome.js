import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Đảm bảo import đúng cấu hình Firebase
import "./headerhome.css";


const HeaderHome = ({ user }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]); // Danh sách công việc từ Firebase
  const [filteredJobs, setFilteredJobs] = useState([]); // Kết quả tìm kiếm


  // Lấy danh sách công việc từ Firebase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };


    fetchJobs();
  }, []);


  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
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
    // Lọc danh sách công việc theo tên hoặc công ty
    const results = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if(searchQuery === "")
      setFilteredJobs([]);
    else
      setFilteredJobs(results);
  };


  const checkJobs = (e) => searchQuery !== "" && filteredJobs.length > 0;


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
      {/* Hiển thị kết quả tìm kiếm */}
      <div className="container mt-4">
        {filteredJobs.length > 0 ? (
          <div className="job-list">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <h3>
                  <Link to={`/jobdetails/${job.id}`}>{job.title}</Link>
                </h3>
                <p>Company: {job.company}</p>
                <p>Description: {job.description}</p>
                <p>Location: {job.location}</p>
              </div>
            ))}
          </div>
        ) : (
          searchQuery && <p>No jobs found matching your search.</p>
        )}
      </div>
    </>
  );
};


export default HeaderHome;
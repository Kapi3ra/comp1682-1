import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Import Firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./components/firebase"; // Firebase configuration
import { doc, getDoc } from "firebase/firestore";

// Import pages
import Login from "./components/login";
import Register from "./components/register";
import JobForm from "./components/job/jobform";
import JobDetails from "./components/job/jobdetails";
import JobList from "./components/job/joblist";
import JobApplicants from "./components/job/jobapplicants";
import Home from "./components/home"; // Import Home page
import Profile from "./components/profile";

// Import Header
import HeaderHome from "./components/header/headerhome";

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // User role
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role); // Fetch role from Firestore
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && <HeaderHome user={user} />}
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/home" element={<Home user={user} />} /> {/* Add Home route */}
          <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/joblist" element={<JobList user={user} role={role} />} />
          <Route
            path="/createjob"
            element={role === "manager" ? <JobForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/editjob/:jobId"
            element={role === "manager" ? <JobForm /> : <Navigate to="/login" />}
          />
          <Route path="/jobdetails/:jobId" element={<JobDetails user={user} role={role} />} />
          <Route
            path="/jobapplicants/:jobId"
            element={role === "manager" ? <JobApplicants /> : <Navigate to="/login" />}
          />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </div>
    </>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;

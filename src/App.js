import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Import các trang chính
import Home from "./components/home";
import Login from "./components/login";
import SignUp from "./components/register";
import Profile from "./components/profile";

// Import hook phân quyền
import useUserRole from "./components/useuserrole";

// Import các trang liên quan đến công việc
import JobList from "./components/job/joblist";
import JobDetails from "./components/job/jobdetails";
import ApplyJob from "./components/job/applyjob";
import ManageJobs from "./components/job/managejobs";
import ManageApplications from "./components/manageapplications";

// Import Header
import HeaderHome from "./components/header/headerhome";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const location = useLocation();
  const { role } = useUserRole(); // Lấy role từ hook phân quyền

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Dữ liệu đã tải xong
    });

    return () => unsubscribe();
  }, []);

  // Kiểm tra nếu đang tải dữ liệu hoặc chưa xác thực
  if (loading) {
    return <div>Loading...</div>;
  }

  // Kiểm tra nếu là trang đăng nhập hoặc đăng ký
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && <HeaderHome user={user} />} {/* Hiển thị HeaderHome nếu không ở trang đăng nhập */}
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Điều hướng mặc định đến /login */}
          <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/profile" /> : <SignUp />} />
          <Route path="/joblist" element={user ? <JobList /> : <Navigate to="/login" />} />
          <Route path="/jobdetails/:jobId" element={user ? <JobDetails /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/applyjob" element={user ? <ApplyJob /> : <Navigate to="/login" />} />
          <Route
            path="/managejobs"
            element={user && role === "manager" ? <ManageJobs /> : <Navigate to="/login" />}
          />
          <Route
            path="/manageapplications"
            element={user && role === "manager" ? <ManageApplications /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <ToastContainer />
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

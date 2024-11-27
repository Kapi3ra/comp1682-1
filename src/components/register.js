import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "react-toastify";
import "./login.css"; // Sử dụng chung file CSS với login

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("user"); // Mặc định là User
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lưu thông tin người dùng vào Firestore
      await setDoc(doc(db, "users", user?.uid), {
        email: user.email,
        displayName,
        role, // Vai trò được chọn từ form
        createdAt: new Date().toISOString(),
      });

      toast.success("Registration successful!", {
        position: "top-center",
      });

      // Làm mới lại trang sau khi đăng ký thành công
      setEmail("");
      setPassword("");
      setDisplayName("");
      setRole("user");
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(`Error: ${error.message}`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-wrapper" onSubmit={handleRegister}>
      <div className="auth-inner">
        <h3>Register</h3>
        <div className="mb-3">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="manager">HR Manager</option>
          </select>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered? <a href="/login">Log in</a>
        </p>
      </div>
    </form>
  );
};

export default Register;

import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const Home = ({ user }) => {
  const [homeData, setHomeData] = useState([]); // Dữ liệu từ bộ sưu tập "home_data"
  const [displayName, setDisplayName] = useState("Guest"); // Tên người dùng mặc định
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Lấy thông tin người dùng từ Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.uid) return; // Kiểm tra nếu không có thông tin user

      try {
        const userDocRef = doc(db, "users", user.uid); // Truy vấn tài liệu người dùng
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setDisplayName(userData.displayName || "No Name"); // Gán tên người dùng hoặc mặc định
        } else {
          console.error("User document does not exist.");
          setDisplayName("Unknown User");
        }
      } catch (err) {
        setError(`Failed to fetch user data: ${err.message}`);
      }
    };

    fetchUserData();
  }, [user]);

  // Lấy dữ liệu từ bộ sưu tập "home_data"
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "home_data")); // Lấy dữ liệu từ bộ sưu tập
        const items = snapshot.docs.map((doc) => doc.data()); // Chuyển đổi tài liệu thành dữ liệu
        setHomeData(items);
      } catch (err) {
        setError(`Failed to fetch home data: ${err.message}`);
      }
    };

    fetchHomeData();
  }, []);

  // Hiển thị lỗi nếu có
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Welcome, {displayName}!</h1> {/* Hiển thị tên người dùng */}
      <ul>
        {homeData.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

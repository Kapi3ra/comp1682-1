import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "home_data"));
        const items = snapshot.docs.map((doc) => doc.data());
        setData(items);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching home data:", err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>; // Hiển thị lỗi rõ ràng trên giao diện
  }

  return (
    <div>
      <h1>Home Page</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

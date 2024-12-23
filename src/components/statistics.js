import React from "react";

const Statistics = ({ user }) => {
  return (
    <div>
      <h1>Statistics Dashboard</h1>
      <p>Welcome, {user?.email || "User"}!</p>
      <p>This is the statistics page where you can monitor data and insights.</p>
    </div>
  );
};

export default Statistics;

import React from "react";

const Application = ({ applications }) => {
  return (
    <div>
      <h1>Application Tracking</h1>
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            {app.jobTitle} - {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Application;

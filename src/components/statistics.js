import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const Statistics = () => {
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    jobsByCompany: {},
    jobLocations: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobStatistics = async () => {
      try {
        const snapshot = await getDocs(collection(db, "jobs"));
        const jobs = snapshot.docs.map((doc) => doc.data());

        const stats = {
          totalJobs: jobs.length,
          jobsByCompany: jobs.reduce((acc, job) => {
            acc[job.company] = (acc[job.company] || 0) + 1;
            return acc;
          }, {}),
          jobLocations: jobs.reduce((acc, job) => {
            acc[job.location] = (acc[job.location] || 0) + 1;
            return acc;
          }, {}),
        };

        setJobStats(stats);
      } catch (error) {
        console.error("Error fetching job statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobStatistics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Statistics</h1>
      <div>
        <h2>Total Jobs: {jobStats.totalJobs}</h2>
        <h3>Jobs by Company:</h3>
        <ul>
          {Object.entries(jobStats.jobsByCompany).map(([company, count]) => (
            <li key={company}>
              {company}: {count} job(s)
            </li>
          ))}
        </ul>
        <h3>Job Locations:</h3>
        <ul>
          {Object.entries(jobStats.jobLocations).map(([location, count]) => (
            <li key={location}>
              {location}: {count} job(s)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Statistics;

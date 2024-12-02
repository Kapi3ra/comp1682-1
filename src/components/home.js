import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Link } from "react-router-dom";

const Home = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsSnapshot = await getDocs(collection(db, "jobs"));
        const allJobs = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (user) {
          // Fetch user-applied jobs
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          const appliedJobIds = userData.appliedJobs || []; // Fetch applied jobs for the user

          // Filter out jobs the user has already applied for
          const newJobs = allJobs.filter((job) => !appliedJobIds.includes(job.id));
          setJobs(newJobs);
        } else {
          // If no user, show all jobs
          setJobs(allJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (jobs.length === 0) {
    return <div>No new jobs available.</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Welcome to the Job Board</h1>
      <h2>New Jobs Available</h2>
      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{job.title}</h5>
              <p className="card-text"><strong>Company:</strong> {job.company}</p>
              <p className="card-text"><strong>Location:</strong> {job.location}</p>
              <p className="card-text"><strong>Posted:</strong> {job.postedDate}</p>
              <Link to={`/jobdetails/${job.id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

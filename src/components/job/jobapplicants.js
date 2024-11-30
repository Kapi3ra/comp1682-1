import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const docRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(docRef);

        if (jobSnap.exists() && jobSnap.data().applicants) {
          setApplicants(jobSnap.data().applicants);
        } else {
          console.error("No applicants found!");
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (applicants.length === 0) {
    return <div>No applicants found for this job.</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Applicants</h1>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Back
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Applied Date</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => (
            <tr key={index}>
              <td>{applicant.name || "N/A"}</td>
              <td>{applicant.email}</td>
              <td>{new Date(applicant.appliedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobApplicants;

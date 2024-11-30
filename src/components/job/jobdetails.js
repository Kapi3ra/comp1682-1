import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

const JobDetails = ({ user, role }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const docRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(docRef);

        if (jobSnap.exists()) {
          setJob({ id: jobSnap.id, ...jobSnap.data() });
        } else {
          console.error("Job not found!");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApply = async () => {
    if (!user) {
      alert("You must be logged in to apply for a job.");
      return;
    }

    try {
      const jobRef = doc(db, "jobs", jobId);

      // Thêm thông tin ứng viên mới vào mảng "applicants"
      await updateDoc(jobRef, {
        applicants: arrayUnion({
          name: user.displayName || "Anonymous",
          email: user.email,
          appliedAt: new Date().toISOString(),
        }),
      });

      alert("Your application has been submitted!");
      setJob((prevJob) => ({
        ...prevJob,
        applicants: [
          ...(prevJob.applicants || []),
          {
            name: user.displayName || "Anonymous",
            email: user.email,
            appliedAt: new Date().toISOString(),
          },
        ],
      }));
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for the job. Please try again.");
    }
  };

  const handleCancelApply = async () => {
    if (!user) return;
  
    const confirmCancel = window.confirm("Are you sure you want to cancel your application?");
    if (!confirmCancel) return;
  
    try {
      const jobRef = doc(db, "jobs", jobId);
      const appliedApplicant = job.applicants?.find((applicant) => applicant.email === user.email);
  
      if (appliedApplicant) {
        await updateDoc(jobRef, {
          applicants: arrayRemove(appliedApplicant),
        });
  
        // Xóa ứng viên khỏi state local
        setJob((prevJob) => ({
          ...prevJob,
          applicants: prevJob.applicants?.filter((applicant) => applicant.email !== user.email),
        }));
  
        alert("Your application has been canceled.");
      }
    } catch (error) {
      console.error("Error canceling application:", error);
      alert("Failed to cancel your application. Please try again.");
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found!</div>;
  }

  // Kiểm tra xem user đã apply chưa
  const userApplied = job.applicants?.some((applicant) => applicant.email === user?.email);

  return (
    <div className="container mt-4">
      <h1>Job Details</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Job Title: {job.title}</h5>
          <p className="card-text"><strong>Company:</strong> {job.company}</p>
          <p className="card-text"><strong>Job Description:</strong> {job.description}</p>
          <p className="card-text"><strong>Location:</strong> {job.location}</p>
          <p className="card-text"><strong>Posted Date:</strong> {job.postedDate}</p>
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <strong>Requirements:</strong>
              <ul>
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          {role === "user" && (
            <div className="d-flex mt-4">
              {userApplied ? (
                <button className="btn btn-danger me-2" onClick={handleCancelApply}>
                  Cancel Apply
                </button>
              ) : (
                <button className="btn btn-success me-2" onClick={handleApply}>
                  Apply
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => navigate("/joblist")}>
                Back to Jobs
              </button>
            </div>
          )}
        </div>
      </div>
      {role === "manager" && (
        <div className="mt-4">
          <h2>Applicants</h2>
          {job.applicants && job.applicants.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {job.applicants.map((applicant, index) => (
                  <tr key={index}>
                    <td>{applicant.name || "N/A"}</td>
                    <td>{applicant.email}</td>
                    <td>{new Date(applicant.appliedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No applicants</p> // Mặc định hiển thị "No applicants" khi không có ứng viên
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { AiFillEye, AiFillEdit, AiFillDelete, AiOutlineCheck } from "react-icons/ai";


const JobList = ({ role, user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Correctly define location


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "jobs"));
        const jobList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJobs(jobList);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchJobs();
    setSearchTerm("");
  }, [location.pathname]); // Correctly set the dependency array


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;


    try {
      await deleteDoc(doc(db, "jobs", id));
      setJobs(jobs.filter((job) => job.id !== id));
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete the job. Please try again.");
    }
  };


  const handleViewApplicants = (jobId) => {
    if (role === "manager") {
      navigate(`/jobapplicants/${jobId}`);
    }
  };


  const userAppliedToJob = (applicants) => {
    return applicants?.some((applicant) => applicant.email === user?.email);
  };


  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="container mt-4">
      <h1>Job Listings</h1>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search jobs by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>
      {role === "manager" && (
        <button
          className="btn btn-primary mb-3 d-flex align-items-center"
          onClick={() => navigate("/createjob")}
        >
          Add Job
        </button>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Description</th>
            <th>Location</th>
            <th>Posted Date</th>
            <th>Applicants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>
                {job.description?.length > 100
                  ? `${job.description.slice(0, 100)}...`
                  : job.description}
              </td>
              <td>{job.location}</td>
              <td>{job.postedDate}</td>
              <td>
                {role === "manager" ? (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleViewApplicants(job.id)}
                  >
                    View ({job.applicants?.length || 0})
                  </button>
                ) : userAppliedToJob(job.applicants) ? (
                  <AiOutlineCheck style={{ color: "green", fontSize: "1.5em" }} />
                ) : (
                  <span>No applicants</span>
                )}
              </td>
              <td>
                <Link to={`/jobdetails/${job.id}`} className="btn btn-info btn-sm me-2">
                  <AiFillEye />
                </Link>
                {role === "manager" && (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => navigate(`/editjob/${job.id}`)}
                    >
                      <AiFillEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <AiFillDelete />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {filteredJobs.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No jobs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


export default JobList;
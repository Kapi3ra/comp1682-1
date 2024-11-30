import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const JobForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    postedDate: "",
    requirements: [], // Danh sách yêu cầu công việc
  });

  const checklistOptions = [
    "Strong communication skills",
    "Teamwork and collaboration",
    "Problem-solving skills",
    "Adaptability",
    "Technical proficiency",
    "Time management",
    "Leadership qualities",
    "Customer service orientation",
    "Knowledge of the industry",
    "Analytical thinking",
    "Attention to detail",
    "Creativity and innovation",
    "Ability to work under pressure",
    "Project management skills",
    "Critical thinking",
    "Self-motivation",
    "Conflict resolution skills",
    "Fluency in English",
    "Experience with specific tools/software",
    "Degree or certification in a relevant field",
  ];

  useEffect(() => {
    if (location.state?.job) {
      setFormData(location.state.job);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChecklistChange = (option) => {
    setFormData((prev) => {
      const isChecked = prev.requirements.includes(option);
      if (isChecked) {
        return { ...prev, requirements: prev.requirements.filter((item) => item !== option) };
      } else {
        return { ...prev, requirements: [...prev.requirements, option] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = jobId
        ? doc(db, "jobs", jobId)
        : doc(collection(db, "jobs"));

      await setDoc(docRef, formData, { merge: true });
      alert(jobId ? "Job updated successfully!" : "Job added successfully!");
      navigate("/joblist");
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h1>{jobId ? "Edit Job" : "Create Job"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter job title"
            required
          />
        </div>
        <div className="mb-3">
          <label>Company Name</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter company name"
            required
          />
        </div>
        <div className="mb-3">
          <label>Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter job description"
            rows="4"
            required
          />
        </div>
        <div className="mb-3">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter location"
            required
          />
        </div>
        <div className="mb-3">
          <label>Posted Date</label>
          <input
            type="date"
            name="postedDate"
            value={formData.postedDate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Job Requirements</label>
          <div>
            {checklistOptions.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`requirement-${index}`}
                  checked={formData.requirements.includes(option)}
                  onChange={() => handleChecklistChange(option)}
                />
                <label className="form-check-label" htmlFor={`requirement-${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {jobId ? "Update Job" : "Add Job"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;

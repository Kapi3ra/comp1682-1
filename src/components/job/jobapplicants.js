import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


const JobApplicants = () => {
  const { jobId } = useParams(); // Lấy jobId từ URL
  const navigate = useNavigate(); // Điều hướng người dùng
  const [applicants, setApplicants] = useState([]); // Danh sách ứng viên
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu


  // Fetch danh sách ứng viên từ Firestore
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const docRef = doc(db, "jobs", jobId); // Tham chiếu đến tài liệu job trong Firestore
        const jobSnap = await getDoc(docRef); // Lấy dữ liệu job


        if (jobSnap.exists()) {
          const jobData = jobSnap.data();
          setApplicants(jobData.applicants || []); // Lấy danh sách ứng viên, mặc định là mảng rỗng nếu không có
        } else {
          console.error("No job found with this ID.");
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false); // Kết thúc trạng thái tải dữ liệu
      }
    };


    fetchApplicants();
  }, [jobId]);


  // Nếu đang tải dữ liệu, hiển thị Loading
  if (loading) {
    return <div>Loading...</div>;
  }


  // Nếu không có ứng viên, hiển thị thông báo
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
              <td>{applicant.name || "N/A"}</td> {/* Hiển thị tên ứng viên */}
              <td>{applicant.email}</td> {/* Hiển thị email ứng viên */}
              <td>{new Date(applicant.appliedAt).toLocaleString()}</td> {/* Hiển thị ngày ứng tuyển */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default JobApplicants;
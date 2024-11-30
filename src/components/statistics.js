import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [user, setUser] = useState(null);

    // Lấy thông tin người dùng hiện tại
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    // Lấy danh sách đơn ứng tuyển nếu là admin
    useEffect(() => {
        if (user && user.email === "admin@example.com") {
            const fetchApplications = async () => {
                const db = getFirestore();
                const appsSnapshot = await getDocs(collection(db, "applications"));
                const appsData = appsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })).filter(app => app.applicantName && app.jobId); // Chỉ lấy dữ liệu hợp lệ
                setApplications(appsData);
            };

            fetchApplications();
        }
    }, [user]);

    // Điều hướng nếu không phải admin hoặc chưa đăng nhập
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.email !== "admin@example.com") {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <h2>Manage Applications</h2>
            <ul>
                {applications.map((app) => (
                    <li key={app.id}>
                        Applicant: {app.applicantName} - Job ID: {app.jobId}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageApplications;

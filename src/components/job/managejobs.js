import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [newJob, setNewJob] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user && user.email === "admin@example.com") {
            const fetchJobs = async () => {
                const db = getFirestore();
                const jobsSnapshot = await getDocs(collection(db, 'jobs'));
                const jobsData = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setJobs(jobsData);
            };

            fetchJobs();
        }
    }, [user]);

    const addJob = async () => {
        if (!newJob.trim()) {
            alert("Job title cannot be empty.");
            return;
        }
        const db = getFirestore();
        await addDoc(collection(db, "jobs"), { title: newJob.trim() });
        alert("Job added!");
        setNewJob(""); // Reset input
    };

    const deleteJob = async (jobId) => {
        const db = getFirestore();
        await deleteDoc(doc(db, 'jobs', jobId));
        alert('Job deleted!');
    };

    // Kiểm tra nếu người dùng chưa đăng nhập hoặc không phải admin
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.email !== "admin@example.com") {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <h2>Manage Jobs</h2>
            <input
                type="text"
                placeholder="New Job Title"
                value={newJob}
                onChange={(e) => setNewJob(e.target.value)}
            />
            <button onClick={addJob}>Add Job</button>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        {job.title} <button onClick={() => deleteJob(job.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageJobs;

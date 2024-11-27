import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const JobList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            const db = getFirestore();
            const jobsCollection = collection(db, 'jobs');
            const jobsSnapshot = await getDocs(jobsCollection);
            const jobsData = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setJobs(jobsData);
        };

        fetchJobs();
    }, []);

    return (
        <div>
            <h2>Available Jobs</h2>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <h3>{job.title}</h3>
                        <p>{job.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobList;

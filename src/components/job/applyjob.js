import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const ApplyJob = () => {
    const [applicantName, setApplicantName] = useState('');
    const [jobId, setJobId] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const db = getFirestore();
        await addDoc(collection(db, 'applications'), {
            applicantName,
            jobId,
            message,
        });
        alert('Application submitted!');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Apply for a Job</h2>
            <input
                type="text"
                placeholder="Your Name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Job ID"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
            />
            <textarea
                placeholder="Why are you a good fit?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Submit Application</button>
        </form>
    );
};

export default ApplyJob;

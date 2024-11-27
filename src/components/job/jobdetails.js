import React from 'react';
import { useParams } from 'react-router-dom';

const JobDetails = ({ jobData }) => {
    const { jobId } = useParams();
    const job = jobData.find((job) => job.id === jobId);

    if (!job) {
        return <p>Job not found!</p>;
    }

    return (
        <div>
            <h1>{job.title}</h1>
            <p>{job.description}</p>
            <p>Location: {job.location}</p>
        </div>
    );
};

export default JobDetails;

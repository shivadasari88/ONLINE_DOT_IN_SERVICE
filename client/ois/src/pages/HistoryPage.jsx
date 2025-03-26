import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const email = localStorage.getItem("email"); // Get user email

    useEffect(() => {
        if (!email) return;

        const fetchHistory = async () => {
            try {
                const response = await axios.get(`/api/application-history/${email}`);
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching application history:", error);
            }
        };

        fetchHistory();
    }, [email]);

    return (
        <div className="container">
            <h2>Application History</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Application Name</th>
                        <th>Submitted At</th>
                        <th>Status</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? (
                        history.map((app, index) => (
                            <tr key={index}>
                                <td>{app.applicationName}</td>
                                <td>{new Date(app.submittedAt).toLocaleString()}</td>
                                <td>{app.status}</td>
                                <td>{app.remarks || "N/A"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No applications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryPage;

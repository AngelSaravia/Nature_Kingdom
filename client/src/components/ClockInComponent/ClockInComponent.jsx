import React, { useEffect, useState } from "react";
import "./ClockInComponent.css";
import { getClockIn, clockIn, clockOut } from "../../services/api";

function ClockInComponent() {
    const email = localStorage.getItem("email");
    const [isClockIn, setIsClockIn] = useState(null); // start with null
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchStatus = async () => {
        try {
            const fetchedClockIn = await getClockIn(email);
            console.log("fetchedClockIn", fetchedClockIn);
            setIsClockIn(fetchedClockIn.data);
        } catch (error) {
            console.error("Error checking clock-in status:", error);
            setMessage("Failed to fetch clock-in status.");
        }
    };

    useEffect(() => {
        if (email) {
            fetchStatus();
        }
    }, []);

    const handleClockIn = async () => {
        setLoading(true);
        try {
            const response = await clockIn(email);
            setMessage(response.message);
            await fetchStatus();
        } catch (error) {
            console.error("Clock-in failed:", error);
            setMessage("Clock-in failed.");
        }
        setLoading(false);
    };

    const handleClockOut = async () => {
        setLoading(true);
        try {
            const response = await clockOut(email);
            setMessage(response.message);
            await fetchStatus();
        } catch (error) {
            console.error("Clock-out failed:", error);
            setMessage("Clock-out failed.");
        }
        setLoading(false);
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {isClockIn?.clocked_in ? (
                        <button className="clock-out-button" onClick={handleClockOut}>
                            Clock Out
                        </button>
                    ) : (
                        <button className="clock-in-button" onClick={handleClockIn}>
                            Clock In
                        </button>
                    )}
                    {/* {message && <p className="message">{message}</p>} */}
                </>
            )}
        </div>
    );
}

export default ClockInComponent;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

const useMockData = false; // Set to false for real API calls

const EmployeeProfile: React.FC = () => {
  const { role, setRole, userName } = useAuth(); // Get role & username from AuthContext
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (useMockData) {
          // Simulate API delay
          setTimeout(() => {
            setRole("ASSET"); // Mocked role data
            setLoading(false);
          }, 1000);
          return;
        }

        const response = await axios.get("/panchayat-employee/profile", {
          headers: { Authorization: `Bearer YOUR_JWT_TOKEN` }, // Replace with actual token
        });

        if (response.data.statusCode === 200) {
          setRole(response.data.data.Role);
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    if (!role) fetchProfile();
    else setLoading(false);
  }, [role, setRole]);

  return (
    <div className="container mt-4">
      <h2>Panchayat Employee Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="card p-3">
          <p>
            <strong>Name:</strong> {userName || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {role}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;

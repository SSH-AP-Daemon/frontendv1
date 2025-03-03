import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useAuth } from "../AuthContext";
import { Card, Spinner, Alert } from "react-bootstrap";

const GovernmentAgencyProfile: React.FC = () => {
  const { userName } = useAuth();
  const [profile, setProfile] = useState<{ Role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // const response = await axios.get("/government-agency/profile");
      const response = { data: { data: { Role: "Environmental Management" } } }; // Mock response
      setProfile(response.data.data);
    } catch (err) {
      setError("Failed to fetch profile.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Government Agency Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        profile && (
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title>Agency Details</Card.Title>
              <Card.Text>
                <strong>User Name:</strong> {userName}
              </Card.Text>
              <Card.Text>
                <strong>Role:</strong> {profile.Role}
              </Card.Text>
            </Card.Body>
          </Card>
        )
      )}
    </div>
  );
};

export default GovernmentAgencyProfile;

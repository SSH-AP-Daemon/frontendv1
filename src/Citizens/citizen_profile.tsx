import React, { useEffect, useState } from "react";
import { Container, Card, ListGroup, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axiosConfig.tsx";

interface Profile {
  Date_of_birth: string;
  Date_of_death?: string | null;
  Gender: "Male" | "Female" | "Other";
  Address: string;
  Educational_qualification:
    | "Illiterate"
    | "Primary"
    | "Secondary"
    | "10th"
    | "12th"
    | "Graduate"
    | "Post-Graduate";
  Occupation: string;
}

const CitizenProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/citizen/profile");
        console.log("API Response:", response.data); // Add this for debugging

        // Check if response.data.data exists and set it to profile
        if (response.data && response.data.data) {
          setProfile(response.data.data); // Changed this line
        } else {
          setError("Failed to fetch profile details.");
          setTimeout(() => {
            setError(null);
          }, 2000);
        }
      } catch (err) {
        console.error("API Error:", err); // Add this for debugging
        setError("Error fetching profile data. Please try again.");
        setTimeout(() => {
          setError(null);
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Add this for debugging
  useEffect(() => {
    console.log("Current Profile State:", profile);
  }, [profile]);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Citizen Profile</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && profile && (
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-3">
              Profile Details
            </Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Date of Birth:</strong> {profile.Date_of_birth}
              </ListGroup.Item>
              {profile.Date_of_death && (
                <ListGroup.Item>
                  <strong>Date of Death:</strong> {profile.Date_of_death}
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <strong>Gender:</strong> {profile.Gender}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Address:</strong> {profile.Address}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Educational Qualification:</strong>{" "}
                {profile.Educational_qualification}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Occupation:</strong> {profile.Occupation}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {!loading && !error && !profile && (
        <Alert variant="info">No profile data available.</Alert>
      )}
    </Container>
  );
};

export default CitizenProfile;
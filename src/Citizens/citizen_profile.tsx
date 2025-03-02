import React, { useEffect, useState } from "react";
import { Container, Card, ListGroup, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axiosConfig.tsx"; // Import API configuration

// Define interface for profile data
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
  // State to store fetched profile data
  const [profile, setProfile] = useState<Profile | null>(null);
  // State to handle loading
  const [loading, setLoading] = useState<boolean>(true);
  // State to handle error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        /**
         * Uncomment this when backend is ready for testing
         * This will fetch actual profile data.
         */
        const response = await api.get("/citizen/profile");

        // Mock API Response for Testing
        // const response = {
        //   data: {
        //     data: {
        //       Date_of_birth: "1990-05-15",
        //       Date_of_death: null,
        //       Gender: "Male" as "Male" | "Female" | "Other", // ✅ Cast to match expected type
        //       Address: "123, Village Street, District A",
        //       Educational_qualification:
        //         "Graduate" as Profile["Educational_qualification"], // ✅ Cast qualification
        //       Occupation: "Software Engineer",
        //     },
        //   },
        // };

        // Handling API response
        if (response.data) {
          setProfile(response.data);
        } else {
          setError("Failed to fetch profile details.");
        }
      } catch (err) {
        setError("Error fetching profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Citizen Profile</h2>

      {/* Show loading spinner while fetching data */}
      {loading && <Spinner animation="border" className="d-block mx-auto" />}

      {/* Show error message if fetching fails */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Show profile data if available */}
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

      {/* Show message if no profile data is available */}
      {!loading && !error && !profile && (
        <Alert variant="info">No profile data available.</Alert>
      )}
    </Container>
  );
};

export default CitizenProfile;

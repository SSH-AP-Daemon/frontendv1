import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
// import api from "../api/axiosConfig.tsx"; // Import API configuration

// Define interface for infrastructure data
interface Infrastructure {
  Description: string;
  Location: string;
  Funding: number;
  Actual_cost: number;
}

const CitizenInfrastructure: React.FC = () => {
  // State to store fetched infrastructure data
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([]);
  // State to handle loading
  const [loading, setLoading] = useState<boolean>(true);
  // State to handle error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfrastructure = async () => {
      try {
        /**
         * Uncomment below API call when backend is ready for testing.
         * This will fetch actual infrastructure data.
         */

        // const response = await api.get("/citizen/infrastructure", {
        //   headers: { Authorization: `Bearer ${your_jwt_token}` },
        // });

        // Mocked API Response for Testing
        const response = {
          data: {
            data: [
              {
                Description: "Construction of a new school building",
                Location: "Village A",
                Funding: 500000,
                Actual_cost: 480000,
              },
              {
                Description: "Repair of main village road",
                Location: "Village B",
                Funding: 200000,
                Actual_cost: 210000,
              },
              {
                Description: "Installation of solar street lights",
                Location: "Village C",
                Funding: 100000,
                Actual_cost: 95000,
              },
            ],
          },
        };

        // Handling API response
        if (response.data.data) {
          setInfrastructure(response.data.data);
        } else {
          setError("Failed to fetch infrastructure details.");
        }
      } catch (err) {
        setError("Error fetching infrastructure data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInfrastructure();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Village Infrastructure</h2>

      {/* Show loading spinner while fetching data */}
      {loading && <Spinner animation="border" className="d-block mx-auto" />}

      {/* Show error message if fetching fails */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Show infrastructure data if available */}
      {!loading && !error && infrastructure.length > 0 && (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Description</th>
              <th>Location</th>
              <th>Funding Allocated</th>
              <th>Actual Cost</th>
            </tr>
          </thead>
          <tbody>
            {infrastructure.map((project, index) => (
              <tr key={index}>
                <td>{project.Description}</td>
                <td>{project.Location}</td>
                <td>₹ {project.Funding.toLocaleString()}</td>
                <td>₹ {project.Actual_cost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Show message if no infrastructure data is available */}
      {!loading && !error && infrastructure.length === 0 && (
        <Alert variant="info">No infrastructure projects available.</Alert>
      )}
    </Container>
  );
};

export default CitizenInfrastructure;

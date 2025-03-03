import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axiosConfig.tsx"; // Import API configuration

// Define interface for welfare schemes
interface WelfareScheme {
  Scheme_fk: number;
  Scheme_name: string;
  Description: string;
  Application_deadline: string;
  status?: string; // Will be undefined if not applied
}

const CitizenWelfSchemes: React.FC = () => {
  // State to store fetched welfare schemes
  const [schemes, setSchemes] = useState<WelfareScheme[]>([]);
  // State to handle loading
  const [loading, setLoading] = useState<boolean>(true);
  // State to handle error messages
  const [error, setError] = useState<string | null>(null);
  // State to handle application status messages
  const [applyMessage, setApplyMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchWelfareSchemes = async () => {
      try {
        /**
         * Uncomment below API call when backend is ready for testing.
         * This will fetch actual welfare schemes data.
         */

        const response = await api.get("/citizen/welfare-scheme");

        // Mocked API Response for Testing
        // const response = {
        //   data: {
        //     statusCode: 200,
        //     message: "Schemes fetched successfully",
        //     data: [
        //       {
        //         Scheme_fk: 1,
        //         Scheme_name: "Health Insurance Scheme",
        //         Description:
        //           "Provides free health insurance for low-income citizens.",
        //         Application_deadline: "2025-03-31",
        //         status: "APPROVED",
        //       },
        //       {
        //         Scheme_fk: 2,
        //         Scheme_name: "Educational Grant",
        //         Description:
        //           "Scholarship for students pursuing higher education.",
        //         Application_deadline: "2025-06-15",
        //         status: undefined, // Not applied yet
        //       },
        //       {
        //         Scheme_fk: 3,
        //         Scheme_name: "Housing Assistance",
        //         Description:
        //           "Financial support for housing and rent subsidies.",
        //         Application_deadline: "2024-12-01",
        //         status: "PENDING",
        //       },
        //     ],
        //   },
        // };

        // Handling API response
        if (response.data.statusCode === 200) {
          setSchemes(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch schemes.");
        }
      } catch (err) {
        setError("Error fetching schemes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWelfareSchemes();
  }, []);

  // Function to apply for a scheme
  const applyForScheme = async (schemeId: number) => {
    try {
      /**
       * Uncomment below API call when backend is ready for testing.
       * This will send an actual application request.
       */

      const response = await api.post("/citizen/welfare-enrol", null, {
        params: {
          Scheme_id: schemeId,
        },
      });

      // Handling application response
      if (
        response.data.statusCode === 200 ||
        response.data.statusCode === 201
      ) {
        setApplyMessage(response.data.message);
        // Update UI to reflect applied status
        setSchemes((prevSchemes) =>
          prevSchemes.map((scheme) =>
            scheme.Scheme_fk === schemeId
              ? { ...scheme, status: "PENDING" }
              : scheme
          )
        );
      } else {
        setError("Failed to apply for the scheme.");
      }
    } catch (err) {
      setError("Error applying for the scheme. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Welfare Schemes</h2>

      {/* Show loading spinner while fetching data */}
      {loading && <Spinner animation="border" className="d-block mx-auto" />}

      {/* Show error message if fetching fails */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Show success message after applying */}
      {applyMessage && <Alert variant="success">{applyMessage}</Alert>}

      {/* Show welfare schemes if available */}
      {!loading && !error && schemes.length > 0 && (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Scheme Name</th>
              <th>Description</th>
              <th>Application Deadline</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme) => (
              <tr key={scheme.Scheme_fk}>
                <td>{scheme.Scheme_name}</td>
                <td>{scheme.Description}</td>
                <td>
                  {new Date(scheme.Application_deadline).toLocaleDateString()}
                </td>
                <td>
                  {scheme.status ? (
                    <span
                      className={`badge ${
                        scheme.status === "APPROVED"
                          ? "bg-success"
                          : scheme.status === "PENDING"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {scheme.status}
                    </span>
                  ) : (
                    <span className="badge bg-secondary">Not Applied</span>
                  )}
                </td>
                <td>
                  {/* Show "Apply" button only if not applied yet */}
                  {scheme.status === "NOT_APPLIED" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => applyForScheme(scheme.Scheme_fk)}
                    >
                      Apply
                    </Button>
                  )}
                  {/* Show disabled button if already applied */}
                  {scheme.status !== "NOT_APPLIED" && (
                    <Button variant="secondary" size="sm" disabled>
                      Applied
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Show message if no welfare schemes are available */}
      {!loading && !error && schemes.length === 0 && (
        <Alert variant="info">No welfare schemes available.</Alert>
      )}
    </Container>
  );
};

export default CitizenWelfSchemes;

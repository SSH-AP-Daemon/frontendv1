import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axiosConfig.tsx"; // Import API configuration

interface FamilyMember {
  user_name: string;
}

const CitizenFamily: React.FC = () => {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        // Simulating API response with dummy data
        const response = await api.get("/citizen/family");
        // const response = {
        //   data: {
        //     statusCode: 200,
        //     message: "Family members fetched successfully",
        //     data: [
        //       { user_name: "john_doe" },
        //       { user_name: "jane_doe" },
        //       { user_name: "emma_smith" },
        //       { user_name: "alex_johnson" },
        //     ],
        //   },
        // };

        if (response.data.statusCode === 200) {
          setFamily(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch family members.");
          setTimeout(() => {
            setError(null);
          }, 2000);
        }
      } catch (err: any) {
        setError("Error fetching family data. Please try again.");
        setTimeout(() => {
          setError(null);
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Family Members</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && family.length === 0 && (
        <Alert variant="info">No family members found.</Alert>
      )}

      {!loading && !error && family.length > 0 && (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {family.map((member, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{member.user_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CitizenFamily;

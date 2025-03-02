import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Button, Form, Table, Alert } from "react-bootstrap";

// Define Types
interface Infrastructure {
  Infra_id: number;
  Description: string;
  Location: string;
  Funding: number;
  Actual_cost: number;
  Government_agencies_fk: number;
  government_agency_user_name: string;
}

const EmployeeInfrastructure: React.FC = () => {
  const { userName, role } = useAuth();
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role !== "INFRASTRUCTURE") {
      setError("You are not authorized to manage infrastructure projects.");
      setLoading(false);
      return;
    }
    fetchInfrastructure();
  }, [userName, role]);

  const mockInfrastructure = [
    {
      Infra_id: 1,
      Description: "Road Construction in Village A",
      Location: "Village A",
      Funding: 500000,
      Actual_cost: 450000,
      Government_agencies_fk: 101,
      government_agency_user_name: "Gov Agency 1",
    },
    {
      Infra_id: 2,
      Description: "Water Supply Project",
      Location: "Village B",
      Funding: 300000,
      Actual_cost: 320000,
      Government_agencies_fk: 102,
      government_agency_user_name: "Gov Agency 2",
    },
  ];

  const fetchInfrastructure = async () => {
    try {
      setLoading(true);
      // const response = await axios.get("/panchayat-employee/infrastructure");
      let response = { data: { data: mockInfrastructure } }; // Mock response
      setInfrastructure(response.data.data);
    } catch (err) {
      setError("Failed to fetch infrastructure projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActualCost = async (
    infraId: number,
    actualCost: number
  ) => {
    try {
      await axios.patch("/panchayat-employee/infrastructure", {
        Infra_id: infraId,
        actual_cost: actualCost,
      });
      fetchInfrastructure();
    } catch (err) {
      setError("Failed to update actual cost.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Infrastructure Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Location</th>
              <th>Funding</th>
              <th>Actual Cost</th>
              <th>Government Agency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {infrastructure.map((infra, index) => (
              <tr key={infra.Infra_id}>
                <td>{index + 1}</td>
                <td>{infra.Description}</td>
                <td>{infra.Location}</td>
                <td>{infra.Funding}</td>
                <td>{infra.Actual_cost}</td>
                <td>{infra.government_agency_user_name}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleUpdateActualCost(
                        infra.Infra_id,
                        infra.Actual_cost + 5000
                      )
                    }
                  >
                    Update Cost
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default EmployeeInfrastructure;

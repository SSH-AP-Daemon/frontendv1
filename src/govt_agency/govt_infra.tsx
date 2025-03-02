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
}

const GovernmentInfrastructure: React.FC = () => {
  const { userType, role } = useAuth();
  const [infrastructure, setInfrastructure] =
    useState<Infrastructure[]>(mockInfrastructure);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [newInfra, setNewInfra] = useState<Omit<Infrastructure, "Infra_id">>({
    Description: "",
    Location: "",
    Funding: 0,
    Actual_cost: 0,
  });

  useEffect(() => {
    if (userType !== "GOVERNMENT_AGENCY" || role !== "INFRASTRUCTURE") {
      setError("You are not authorized to manage infrastructure.");
      setLoading(false);
      return;
    }
    fetchInfrastructure();
  }, [role, searchLocation]);

  const fetchInfrastructure = async () => {
    try {
      setLoading(true);
      const params: { location?: string } = {};
      if (searchLocation) params.location = searchLocation;

      // const response = await axios.get("/government-agency/infrastructure", { params });
      let response = {
        data: {
          data: mockInfrastructure.filter(
            (i) => !searchLocation || i.Location.includes(searchLocation)
          ),
        },
      }; // Mock response
      setInfrastructure(response.data.data);
    } catch (err) {
      setError("Failed to fetch infrastructure data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (infraId: number) => {
    try {
      // await axios.delete("/government-agency/infrastructure", { data: { Infra_id: infraId } });
      setInfrastructure((prev) => prev.filter((i) => i.Infra_id !== infraId));
    } catch (err) {
      setError("Failed to delete infrastructure.");
    }
  };

  const addInfrastructure = async () => {
    try {
      // const response = await axios.post("/government-agency/infrastructure", newInfra);
      let response = {
        data: { data: { Infra_id: infrastructure.length + 1 } },
      }; // Mock response
      setInfrastructure([
        ...infrastructure,
        { ...newInfra, Infra_id: response.data.data.Infra_id },
      ]);
      setNewInfra({
        Description: "",
        Location: "",
        Funding: 0,
        Actual_cost: 0,
      });
    } catch (err) {
      setError("Failed to add new infrastructure.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Infrastructure Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Form.Control
        type="text"
        placeholder="Search by Location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        className="mb-3"
      />

      {/* Add Infrastructure */}
      <h4>Add New Infrastructure</h4>
      <Form>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Description"
            value={newInfra.Description}
            onChange={(e) =>
              setNewInfra({ ...newInfra, Description: e.target.value })
            }
            className="mb-2"
          />
          <Form.Control
            type="text"
            placeholder="Location"
            value={newInfra.Location}
            onChange={(e) =>
              setNewInfra({ ...newInfra, Location: e.target.value })
            }
            className="mb-2"
          />
          <Form.Control
            type="number"
            placeholder="Funding"
            value={newInfra.Funding || ""}
            onChange={(e) =>
              setNewInfra({
                ...newInfra,
                Funding: parseFloat(e.target.value) || 0,
              })
            }
            className="mb-2"
          />
          <Form.Control
            type="number"
            placeholder="Actual Cost"
            value={newInfra.Actual_cost || ""}
            onChange={(e) =>
              setNewInfra({
                ...newInfra,
                Actual_cost: parseFloat(e.target.value) || 0,
              })
            }
            className="mb-2"
          />
          <Button onClick={addInfrastructure}>Add Infrastructure</Button>
        </Form.Group>
      </Form>

      {/* Infrastructure Table */}
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
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(infra.Infra_id)}
                  >
                    Delete
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

export default GovernmentInfrastructure;

// Mock Data
const mockInfrastructure: Infrastructure[] = [
  {
    Infra_id: 1,
    Description: "Bridge Construction",
    Location: "Town A",
    Funding: 500000,
    Actual_cost: 450000,
  },
  {
    Infra_id: 2,
    Description: "Water Supply System",
    Location: "Village B",
    Funding: 200000,
    Actual_cost: 180000,
  },
  {
    Infra_id: 3,
    Description: "School Renovation",
    Location: "City C",
    Funding: 300000,
    Actual_cost: 250000,
  },
];

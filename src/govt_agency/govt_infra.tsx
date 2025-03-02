import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import api from "../../api/axiosConfig.tsx";
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

interface ApiResponse {
  data: Infrastructure[];
  message: string;
  statusCode: number;
}

const GovernmentAgencyInfrastructure: React.FC = () => {
  const { userType, role } = useAuth();
  const [infrastructures, setInfrastructures] = useState<Infrastructure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newInfrastructure, setNewInfrastructure] = useState<{
    Description: string;
    Location: string;
    Funding: number;
    Actual_cost: number;
  }>({
    Description: "",
    Location: "",
    Funding: 0,
    Actual_cost: 0,
  });

  // Fetch infrastructures from API
  const fetchInfrastructures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ApiResponse>("/government-agency/infrastructure");
      if (response.data.statusCode === 200) {
        setInfrastructures(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch infrastructures");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to fetch infrastructures.");
      } else {
        setError("Failed to fetch infrastructures.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userType !== "GOVERNMENT_AGENCY" || role !== "INFRASTRUCTURE") {
      setError("You are not authorized to manage infrastructures.");
      setLoading(false);
      return;
    }
    fetchInfrastructures();
  }, [userType, role, fetchInfrastructures]);

  // Add new infrastructure
  const addInfrastructure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await api.post("/government-agency/infrastructure", newInfrastructure);
      if (response.data.statusCode === 201) {
        setNewInfrastructure({ Description: "", Location: "", Funding: 0, Actual_cost: 0 });
        await fetchInfrastructures();
      } else {
        throw new Error(response.data.message || "Failed to add infrastructure");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to add infrastructure.");
      } else {
        setError("Failed to add infrastructure.");
      }
    }
  };

  // Delete infrastructure
  const deleteInfrastructure = async (infraId: number) => {
    try {
      setError(null);
      await api.delete("/government-agency/infrastructure", { data: { Infra_id: infraId } });
      await fetchInfrastructures();
    } catch (err) {
      console.log(err);
      setError("Failed to delete infrastructure.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Government Infrastructure</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <h4>Add New Infrastructure</h4>
      <Form onSubmit={addInfrastructure} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            value={newInfrastructure.Description}
            onChange={(e) => setNewInfrastructure({ ...newInfrastructure, Description: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={newInfrastructure.Location}
            onChange={(e) => setNewInfrastructure({ ...newInfrastructure, Location: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Funding</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter funding amount"
            value={newInfrastructure.Funding}
            onChange={(e) => setNewInfrastructure({ ...newInfrastructure, Funding: Number(e.target.value) })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Actual Cost</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter actual cost"
            value={newInfrastructure.Actual_cost}
            onChange={(e) => setNewInfrastructure({ ...newInfrastructure, Actual_cost: Number(e.target.value) })}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">Add Infrastructure</Button>
      </Form>

      {loading ? (
        <div className="text-center"><p>Loading infrastructures...</p></div>
      ) : (
        <Table striped bordered hover responsive>
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
            {infrastructures.map((infra, index) => (
              <tr key={infra.Infra_id}>
                <td>{index + 1}</td>
                <td>{infra.Description}</td>
                <td>{infra.Location}</td>
                <td>{infra.Funding}</td>
                <td>{infra.Actual_cost}</td>
                <td>
                  <Button variant="danger" onClick={() => deleteInfrastructure(infra.Infra_id)}>Delete</Button>
                </td>
              </tr>
            ))}
            {infrastructures.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center">No infrastructures found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default GovernmentAgencyInfrastructure;
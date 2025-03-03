import React, { useEffect, useState } from "react";
// import api from "../../api/axiosConfig";
import { useAuth } from "../AuthContext";
import { Button, Form, Table, Alert, Modal } from "react-bootstrap";
import api from "../../api/axiosConfig";

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
  
  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedInfraId, setSelectedInfraId] = useState<number | null>(null);
  const [newActualCost, setNewActualCost] = useState<number>(0);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  useEffect(() => {
    if (role !== "INFRASTRUCTURE") {
      setError("You are not authorized to manage infrastructure projects.");
      setLoading(false);
      return;
    }
    fetchInfrastructure();
  }, [userName, role]);

  const fetchInfrastructure = async () => {
    try {
      setLoading(true);      
      // Include the token in the Authorization header
      const response = await api.get("/panchayat-employee/infrastructure");
      
      // let response = { data: { data: mockInfrastructure } }; // Mock response
      setInfrastructure(response.data.data);
    } catch (err) {
      console.error("Error fetching infrastructure:", err);
      setError("Failed to fetch infrastructure projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateModal = (infraId: number, currentCost: number) => {
    setSelectedInfraId(infraId);
    setNewActualCost(currentCost);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInfraId(null);
    setNewActualCost(0);
  };

  const handleUpdateActualCost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInfraId) return;
    
    try {
      setUpdateLoading(true);
      setError(null);
      
      await api.put("/panchayat-employee/infrastructure", {
        Infra_id: selectedInfraId,
        actual_cost: newActualCost,
      });
      
      // Close modal and refresh data
      handleCloseModal();
      await fetchInfrastructure();
      
    } catch (err) {
      console.error("Error updating infrastructure cost:", err);
      setError("Failed to update actual cost. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const getInfraNameById = (infraId: number): string => {
    const infra = infrastructure.find(item => item.Infra_id === infraId);
    return infra ? infra.Description : `Project #${infraId}`;
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
                    onClick={() => handleOpenUpdateModal(infra.Infra_id, infra.Actual_cost)}
                  >
                    Update Cost
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Update Cost Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Actual Cost</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateActualCost}>
          <Modal.Body>
            <p>Updating actual cost for: <strong>{selectedInfraId ? getInfraNameById(selectedInfraId) : ''}</strong></p>
            <Form.Group className="mb-3">
              <Form.Label>Infrastructure ID</Form.Label>
              <Form.Control
                type="number"
                value={selectedInfraId || ''}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Actual Cost</Form.Label>
              <Form.Control
                type="number"
                value={newActualCost}
                onChange={(e) => setNewActualCost(Number(e.target.value))}
                required
                min={0}
                step={0.01}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={updateLoading}>
              {updateLoading ? 'Updating...' : 'Update Cost'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeInfrastructure;
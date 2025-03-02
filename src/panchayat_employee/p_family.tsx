import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useAuth } from "../AuthContext";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";

// Dummy Data for Testing
const sampleFamilies = [
  {
    family_id: 1,
    head_citizen_id: 101,
    members: [
      { member_citizen_id: 201, member_user_name: "alice_doe" },
      { member_citizen_id: 202, member_user_name: "bob_doe" },
    ],
  },
  {
    family_id: 2,
    head_citizen_id: 102,
    members: [{ member_citizen_id: 203, member_user_name: "charlie_doe" }],
  },
];

interface Family {
  family_id: number;
  head_citizen_id: number;
  members: { member_citizen_id: number; member_user_name: string }[];
}

const EmployeeFamily: React.FC = () => {
  const { userName, role } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for modals
  const [showModal, setShowModal] = useState(false);
  const [newFamily, setNewFamily] = useState({ head_user_name: "" });

  useEffect(() => {
    if (role !== "FAMILY") {
      setError("You are not authorized to manage families.");
      setLoading(false);
      return;
    }
    fetchFamilies();
  }, [userName, role]);

  // Fetch families
  const fetchFamilies = async () => {
    try {
      setLoading(true);
      // const response = await axios.get(`/panchayat-employee/family/${userName}`, { headers: { Authorization: `Bearer YOUR_JWT_TOKEN` } });
      let response = { data: { data: sampleFamilies } };
      setFamilies(response.data.data);
    } catch (err) {
      setError("Failed to fetch families.");
    } finally {
      setLoading(false);
    }
  };

  // Create new family
  const handleCreateFamily = async () => {
    try {
      // await axios.post("/panchayat-employee/family", { head_user_name: newFamily.head_user_name });
      setShowModal(false);
      setNewFamily({ head_user_name: "" });
      fetchFamilies();
    } catch (err) {
      setError("Failed to create family.");
    }
  };

  // Delete family
  const handleDeleteFamily = async (familyId: number) => {
    try {
      // await axios.delete("/panchayat-employee/family", { data: { family_id: familyId } });
      fetchFamilies();
    } catch (err) {
      setError("Failed to delete family.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Families</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        + Add Family
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Head Citizen ID</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {families.map((family, index) => (
              <tr key={family.family_id}>
                <td>{index + 1}</td>
                <td>{family.head_citizen_id}</td>
                <td>
                  {family.members.map((m) => m.member_user_name).join(", ")}
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteFamily(family.family_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create Family Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Family</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Head User Name</Form.Label>
              <Form.Control
                type="text"
                value={newFamily.head_user_name}
                onChange={(e) =>
                  setNewFamily({ head_user_name: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCreateFamily}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeFamily;

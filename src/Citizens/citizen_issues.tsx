import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import api from "../../api/axiosConfig.tsx"; // Import API configuration

interface Issue {
  Issue_id: number;
  description: string;
  status: string;
}

const CitizenIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newIssue, setNewIssue] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deletingIssue, setDeletingIssue] = useState<number | null>(null);

  const fetchIssues = async () => {
    try {
      // Dummy data for testing
      const response = await api.get("/citizen/issues");

      // const response = {
      //   data: {
      //     statusCode: 200,
      //     message: "Issues fetched successfully",
      //     data: [
      //       {
      //         Issue_id: 1,
      //         description: "Streetlight not working",
      //         status: "Pending",
      //       },
      //       {
      //         Issue_id: 2,
      //         description: "Pothole in front of my house",
      //         status: "Resolved",
      //       },
      //       {
      //         Issue_id: 3,
      //         description: "Water supply issue",
      //         status: "In Progress",
      //       },
      //     ],
      //   },
      // };

      if (response.data.statusCode === 200) {
        setIssues(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch issues.");
      }
    } catch (err) {
      setError("Error fetching issues. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Fetch Issues from API
  useEffect(() => {
    fetchIssues();
  }, []);

  // Handle Issue Submission
  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue.trim()) return;

    try {
      const response = await api.post("/citizen/issues", {
        description: newIssue,
      });

      if (
        response.data.statusCode === 200 ||
        response.data.statusCode === 201
      ) {
        setIssues([
          ...issues,
          {
            Issue_id: response.data.Issue_id,
            description: newIssue,
            status: "Pending",
          },
        ]);
        setNewIssue("");
        setShowModal(false);
        fetchIssues();
      }
    } catch (err) {
      setError("Error creating issue. Please try again.");
    }
  };

  // Handle Issue Deletion
  const handleDeleteIssue = async (id: number) => {
    try {
      const response = await api.delete(`/citizen/issue/`, {
        params: { Issue_id: id },
      });

      if (response.data.statusCode === 200) {
        setIssues(issues.filter((issue) => issue.Issue_id !== id));
        setDeletingIssue(null);
      }
    } catch (err) {
      setError("Error deleting issue. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Citizen Issues</h2>

      {/* Show Loading Spinner */}
      {loading && <Spinner animation="border" className="d-block mx-auto" />}

      {/* Show Error Message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Issues Table */}
      {!loading && !error && issues.length > 0 && (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue.Issue_id}>
                <td>{index + 1}</td>
                <td>{issue.description}</td>
                <td>
                  <span
                    className={`badge ${
                      issue.status === "Resolved"
                        ? "bg-success"
                        : issue.status === "In Progress"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeletingIssue(issue.Issue_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Show No Issues Message */}
      {!loading && !error && issues.length === 0 && (
        <Alert variant="info">No issues reported yet.</Alert>
      )}

      {/* Add Issue Button */}
      <Button className="mt-3" onClick={() => setShowModal(true)}>
        Report New Issue
      </Button>

      {/* Create Issue Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Report New Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateIssue}>
            <Form.Group>
              <Form.Label>Issue Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter issue details..."
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              Submit Issue
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation */}
      {deletingIssue !== null && (
        <Modal show={true} onHide={() => setDeletingIssue(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this issue?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingIssue(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteIssue(deletingIssue)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default CitizenIssues;

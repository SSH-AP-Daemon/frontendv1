import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Table, Button, Form, Alert } from "react-bootstrap";

// Dummy Data for Testing
const sampleIssues = [
  {
    issue_id: 1,
    description: "Road damage",
    status: "Open",
    user_name: "john_doe",
  },
  {
    issue_id: 2,
    description: "Water leakage",
    status: "In Progress",
    user_name: "jane_doe",
  },
  {
    issue_id: 3,
    description: "Street lights not working",
    status: "Resolved",
    user_name: "john_doe",
  },
];

interface Issue {
  issue_id: number;
  description: string;
  status: string;
  user_name: string;
}

const EmployeeIssues: React.FC = () => {
  const { role } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  useEffect(() => {
    if (role !== "ISSUES") {
      setError("You are not authorized to manage issues.");
      setLoading(false);
      return;
    }
    fetchIssues();
  }, [role]);

  // Fetch issues
  const fetchIssues = async () => {
    try {
      setLoading(true);
      // const response = await axios.get(`/panchayat-employee/issues`, { headers: { Authorization: `Bearer YOUR_JWT_TOKEN` } });
      let response = { data: { data: sampleIssues } };
      setIssues(response.data.data);
      setFilteredIssues(response.data.data);
    } catch (err) {
      setError("Failed to fetch issues.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and Sort
  useEffect(() => {
    let filtered = issues;

    if (statusFilter) {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    if (sortOrder) {
      filtered = [...filtered].sort((a, b) =>
        sortOrder === "asc" ? a.issue_id - b.issue_id : b.issue_id - a.issue_id
      );
    }

    setFilteredIssues(filtered);
  }, [statusFilter, sortOrder, issues]);

  // Update Issue Status
  const updateIssueStatus = async (issue_id: number, newStatus: string) => {
    try {
      // await axios.patch(`/panchayat-employee/issues`, { issue_id, status: newStatus }, { headers: { Authorization: `Bearer YOUR_JWT_TOKEN` } });
      setIssues((prev) =>
        prev.map((issue) =>
          issue.issue_id === issue_id ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err) {
      setError("Failed to update issue status.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Issues</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filter & Sorting */}
      <Form className="mb-3 d-flex gap-3">
        <Form.Select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Filter by Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </Form.Select>
        <Form.Select
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "")}
        >
          <option value="">Sort by Issue ID</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Form.Select>
      </Form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue, index) => (
              <tr key={issue.issue_id}>
                <td>{index + 1}</td>
                <td>{issue.description}</td>
                <td>{issue.status}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      updateIssueStatus(issue.issue_id, "In Progress")
                    }
                  >
                    Mark In Progress
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      updateIssueStatus(issue.issue_id, "Resolved")
                    }
                  >
                    Mark Resolved
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

export default EmployeeIssues;

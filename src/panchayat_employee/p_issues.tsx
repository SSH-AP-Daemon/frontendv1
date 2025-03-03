import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../AuthContext";
import { Table, Button, Form, Alert } from "react-bootstrap";

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
      const response = await api.get(`/panchayat-employee/issues`);
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
      const payload = { issue_id, status: newStatus };
      await api.put(`/panchayat-employee/issues`, payload);
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
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
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
                      updateIssueStatus(issue.issue_id, "IN_PROGRESS")
                    }
                  >
                    Mark In Progress
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      updateIssueStatus(issue.issue_id, "RESOLVED")
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

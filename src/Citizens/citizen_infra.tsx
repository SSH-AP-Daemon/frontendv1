import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Button,
  Form,
} from "react-bootstrap";
import api from "../../api/axiosConfig";

// Define interfaces for type safety
interface Infrastructure {
  Infra_id: number;
  Description: string | null;
  Location: string | null;
  Funding: number;
  Actual_cost: number;
}

interface ApiResponse {
  data: Infrastructure[];
  message: string;
  statusCode: number;
}

// Define sort options
type SortField = "Description" | "Location" | "Funding" | "Actual_cost";
type SortOrder = "asc" | "desc";

const CitizenInfrastructure: React.FC = () => {
  // State management
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("Description");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch infrastructure data
  useEffect(() => {
    const fetchInfrastructure = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiResponse>("/citizen/infrastructure");

        if (response.data.statusCode === 200) {
          setInfrastructure(response.data.data);
        } else {
          setError(
            response.data.message || "Failed to fetch infrastructure details."
          );
          setTimeout(() => {
            setError(null);
          }, 2000);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Please login to view infrastructure details.");
        } else if (err.response?.status === 403) {
          setError("You don't have permission to view infrastructure details.");
        } else {
          setError("Error fetching infrastructure data. Please try again.");
        }
        setTimeout(() => {
          setError(null);
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchInfrastructure();
  }, []);

  // Sort infrastructure data
  const sortedInfrastructure = React.useMemo(() => {
    if (!infrastructure) return [];

    return [...infrastructure].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [infrastructure, sortField, sortOrder]);

  // Filter infrastructure data
  const filteredInfrastructure = React.useMemo(() => {
    if (!searchTerm) return sortedInfrastructure;

    return sortedInfrastructure.filter(
      (project) =>
        project.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.Location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedInfrastructure, searchTerm]);

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Loading component
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // Error component
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button
            variant="outline-danger"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Village Infrastructure</h2>

      {/* Search input */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by description or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {filteredInfrastructure.length > 0 ? (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th
                onClick={() => handleSort("Description")}
                style={{ cursor: "pointer" }}
              >
                Description{" "}
                {sortField === "Description" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("Location")}
                style={{ cursor: "pointer" }}
              >
                Location{" "}
                {sortField === "Location" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("Funding")}
                style={{ cursor: "pointer" }}
              >
                Funding Allocated{" "}
                {sortField === "Funding" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("Actual_cost")}
                style={{ cursor: "pointer" }}
              >
                Actual Cost{" "}
                {sortField === "Actual_cost" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInfrastructure.map((project, index) => (
              <tr key={index}>
                <td>{project.Description}</td>
                <td>{project.Location}</td>
                <td>₹ {project.Funding.toLocaleString()}</td>
                <td>₹ {project.Actual_cost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">
          {searchTerm
            ? "No matching infrastructure projects found."
            : "No infrastructure projects available."}
        </Alert>
      )}
    </Container>
  );
};

export default CitizenInfrastructure;

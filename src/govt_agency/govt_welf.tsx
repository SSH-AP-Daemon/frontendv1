import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import api from "../../api/axiosConfig.tsx";
import { useAuth } from "../AuthContext";
import { Button, Form, Table, Alert } from "react-bootstrap";

// Define Types
interface WelfareScheme {
  Scheme_id: number;
  Scheme_name: string;
  Description: string;
  Application_deadline: string;
}

interface ApiResponse {
  data: WelfareScheme[];
  message: string;
  statusCode: number;
}

const GovernmentAgencyWelfare: React.FC = () => {
  const { userType, role } = useAuth();
  const [schemes, setSchemes] = useState<WelfareScheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<WelfareScheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchScheme, setSearchScheme] = useState<string>("");
  const [sortByDeadline, setSortByDeadline] = useState<boolean>(false);
  const [newScheme, setNewScheme] = useState<{
    Scheme_name: string;
    Description: string;
    Application_deadline: string;
  }>({
    Scheme_name: "",
    Description: "",
    Application_deadline: "",
  });

  // Filter and sort schemes function
  const filterAndSortSchemes = useCallback((
    schemesList: WelfareScheme[],
    search: string,
    sort: boolean
  ) => {
    let filtered = [...schemesList];

    if (search) {
      filtered = filtered.filter((scheme) =>
        scheme.Scheme_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort) {
      filtered.sort(
        (a, b) =>
          new Date(a.Application_deadline).getTime() -
          new Date(b.Application_deadline).getTime()
      );
    }

    setFilteredSchemes(filtered);
  }, []);

  // Fetch schemes from API
  const fetchSchemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ApiResponse>("/government-agency/welfare-scheme");
      
      if (response.data.statusCode === 200) {
        setSchemes(response.data.data);
        filterAndSortSchemes(response.data.data, searchScheme, sortByDeadline);
      } else {
        throw new Error(response.data.message || "Failed to fetch schemes");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to fetch welfare schemes.");
      } else {
        setError("Failed to fetch welfare schemes.");
      }
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [searchScheme, sortByDeadline, filterAndSortSchemes]);

  // Initial fetch and authorization check
  useEffect(() => {
    if (userType !== "GOVERNMENT_AGENCY" || role !== "WELFARE_SCHEME") {
      setError("You are not authorized to manage welfare schemes.");
      setTimeout(() => {
        setError(null);
      }, 2000);
      setLoading(false);
      return;
    }
    fetchSchemes();
  }, [userType, role, fetchSchemes]);

  // Handle search and sort changes
  useEffect(() => {
    filterAndSortSchemes(schemes, searchScheme, sortByDeadline);
  }, [schemes, searchScheme, sortByDeadline, filterAndSortSchemes]);

  // Add new scheme
  const addScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      // Validate form
      if (!newScheme.Scheme_name.trim()) {
        setError("Scheme name is required.");
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }
      if (!newScheme.Description.trim()) {
        setError("Description is required.");
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }
      if (!newScheme.Application_deadline) {
        setError("Application deadline is required.");
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }

      // Validate deadline is not in the past
      const deadline = new Date(newScheme.Application_deadline);
      const today = new Date();
      if (deadline < today) {
        setError("Application deadline cannot be in the past.");
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }

      const response = await api.post("/government-agency/welfare-scheme", newScheme);
      
      if (response.data.statusCode === 201) {
        // Reset form
        setNewScheme({
          Scheme_name: "",
          Description: "",
          Application_deadline: "",
        });
        
        // Refresh the list
        await fetchSchemes();
      } else {
        throw new Error(response.data.message || "Failed to add scheme");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to add scheme.");
      } else {
        setError("Failed to add scheme.");
      }
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Government Welfare Schemes</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Form.Control
        type="text"
        placeholder="Search by Scheme Name"
        value={searchScheme}
        onChange={(e) => setSearchScheme(e.target.value)}
        className="mb-3"
      />

      <Form.Check
        type="checkbox"
        label="Sort by Application Deadline"
        checked={sortByDeadline}
        onChange={() => setSortByDeadline(!sortByDeadline)}
        className="mb-3"
      />

      {/* Add New Scheme */}
      <h4>Add New Welfare Scheme</h4>
      <Form onSubmit={addScheme} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Scheme Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter scheme name"
            value={newScheme.Scheme_name}
            onChange={(e) =>
              setNewScheme({ ...newScheme, Scheme_name: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter scheme description"
            value={newScheme.Description}
            onChange={(e) =>
              setNewScheme({ ...newScheme, Description: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Application Deadline</Form.Label>
          <Form.Control
            type="date"
            value={newScheme.Application_deadline}
            onChange={(e) =>
              setNewScheme({
                ...newScheme,
                Application_deadline: e.target.value,
              })
            }
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Add Scheme
        </Button>
      </Form>

      {/* Welfare Schemes Table */}
      {loading ? (
        <div className="text-center">
          <p>Loading welfare schemes...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Scheme Name</th>
              <th>Description</th>
              <th>Application Deadline</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchemes.map((scheme, index) => (
              <tr key={scheme.Scheme_id}>
                <td>{index + 1}</td>
                <td>{scheme.Scheme_name}</td>
                <td>{scheme.Description}</td>
                <td>{new Date(scheme.Application_deadline).toLocaleDateString()}</td>
              </tr>
            ))}
            {filteredSchemes.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-center">
                  No welfare schemes found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default GovernmentAgencyWelfare;
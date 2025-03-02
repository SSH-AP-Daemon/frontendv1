import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Button, Form, Table, Alert } from "react-bootstrap";

// Define Types
interface WelfareScheme {
  Scheme_id: number;
  Scheme_name: string;
  Description: string;
  Application_deadline: string;
}

const mockSchemes: WelfareScheme[] = [
  {
    Scheme_id: 1,
    Scheme_name: "Health Assistance",
    Description: "Medical support for low-income families.",
    Application_deadline: "2025-12-31",
  },
  {
    Scheme_id: 2,
    Scheme_name: "Education Grant",
    Description: "Scholarships for underprivileged students.",
    Application_deadline: "2025-06-30",
  },
];

const GovernmentAgencyWelfare: React.FC = () => {
  const { userType, role } = useAuth();
  const [schemes, setSchemes] = useState<WelfareScheme[]>(mockSchemes);
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

  useEffect(() => {
    if (userType !== "GOVERNMENT_AGENCY" || role !== "WELFARE_SCHEME") {
      setError("You are not authorized to manage welfare schemes.");
      setLoading(false);
      return;
    }
    fetchSchemes();
  }, [role, searchScheme, sortByDeadline]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params: { scheme_name?: string } = {};
      if (searchScheme) params.scheme_name = searchScheme;

      // const response = await axios.get("/government-agency/welfare-scheme", { params });
      let response = { data: { data: mockSchemes } }; // Mock response
      let filteredSchemes = response.data.data.filter((scheme) =>
        scheme.Scheme_name.toLowerCase().includes(searchScheme.toLowerCase())
      );
      if (sortByDeadline) {
        filteredSchemes.sort(
          (a, b) =>
            new Date(a.Application_deadline).getTime() -
            new Date(b.Application_deadline).getTime()
        );
      }
      setSchemes(filteredSchemes);
    } catch (err) {
      setError("Failed to fetch welfare schemes.");
    } finally {
      setLoading(false);
    }
  };

  const deleteScheme = async (id: number) => {
    try {
      // await axios.delete("/government-agency/welfare-scheme", { data: { Scheme_id: id } });
      setSchemes(schemes.filter((scheme) => scheme.Scheme_id !== id));
    } catch (err) {
      setError("Failed to delete scheme.");
    }
  };

  const addScheme = async () => {
    try {
      // const response = await axios.post("/government-agency/welfare-scheme", newScheme);
      let response = { data: { data: { Scheme_id: schemes.length + 1 } } }; // Mock response
      setSchemes([
        ...schemes,
        { ...newScheme, Scheme_id: response.data.data.Scheme_id },
      ]);
      setNewScheme({
        Scheme_name: "",
        Description: "",
        Application_deadline: "",
      });
    } catch (err) {
      setError("Failed to add scheme.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Government Welfare Schemes</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Form.Control
        type="text"
        placeholder="Search Scheme"
        value={searchScheme}
        onChange={(e) => setSearchScheme(e.target.value)}
        className="mb-3"
      />

      <Form.Check
        type="checkbox"
        label="Sort by Deadline"
        checked={sortByDeadline}
        onChange={() => setSortByDeadline(!sortByDeadline)}
        className="mb-3"
      />

      {/* Add New Scheme */}
      <h4>Add New Welfare Scheme</h4>
      <Form>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Scheme Name"
            value={newScheme.Scheme_name}
            onChange={(e) =>
              setNewScheme({ ...newScheme, Scheme_name: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Description"
            value={newScheme.Description}
            onChange={(e) =>
              setNewScheme({ ...newScheme, Description: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="date"
            value={newScheme.Application_deadline}
            onChange={(e) =>
              setNewScheme({
                ...newScheme,
                Application_deadline: e.target.value,
              })
            }
          />
        </Form.Group>
        <Button onClick={addScheme} className="mb-3">
          Add Scheme
        </Button>
      </Form>

      {/* Welfare Schemes */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Scheme Name</th>
              <th>Description</th>
              <th>Application Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme, index) => (
              <tr key={scheme.Scheme_id}>
                <td>{index + 1}</td>
                <td>{scheme.Scheme_name}</td>
                <td>{scheme.Description}</td>
                <td>{scheme.Application_deadline}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => deleteScheme(scheme.Scheme_id)}
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

export default GovernmentAgencyWelfare;

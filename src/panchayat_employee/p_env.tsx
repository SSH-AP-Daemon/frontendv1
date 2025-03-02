import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Button, Form, Table, Alert } from "react-bootstrap";

// Define Types
interface EnvironmentalData {
  Year: number;
  Aqi: number;
  Forest_cover: number;
  Odf: number;
  Afforestation_data: number;
  Precipitation: number;
  Water_quality: number;
}

const EmployeeEnvironment: React.FC = () => {
  const { userName, role } = useAuth();
  const [data, setData] = useState<EnvironmentalData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<string>("");

  useEffect(() => {
    if (role !== "ENVIRONMENTAL_DATA") {
      setError("You are not authorized to manage environmental data.");
      setLoading(false);
      return;
    }
    fetchEnvironmentalData();
  }, [userName, role, yearFilter]);

  const mockData = [
    {
      Year: 2023,
      Aqi: 78.5,
      Forest_cover: 34.2,
      Odf: 95.0,
      Afforestation_data: 12.5,
      Precipitation: 1024.5,
      Water_quality: 85.3,
    },
    {
      Year: 2022,
      Aqi: 80.2,
      Forest_cover: 33.8,
      Odf: 94.5,
      Afforestation_data: 10.2,
      Precipitation: 1100.1,
      Water_quality: 84.1,
    },
  ];

  const fetchEnvironmentalData = async () => {
    try {
      setLoading(true);
      const params: { year?: string } = {};
      if (yearFilter) params.year = yearFilter;

      // const response = await axios.get("/panchayat-employee/environmental-data", { params });
      let response = {
        data: {
          data: mockData.filter(
            (d) => !yearFilter || d.Year.toString() === yearFilter
          ),
        },
      }; // Mock response
      setData(response.data.data);
    } catch (err) {
      setError("Failed to fetch environmental data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddData = async (newData: EnvironmentalData) => {
    try {
      // await axios.post("/panchayat-employee/environmental-data", newData);
      fetchEnvironmentalData();
    } catch (err) {
      setError("Failed to add environmental data.");
    }
  };

  const handleDeleteData = async (year: number) => {
    try {
      // await axios.delete("/panchayat-employee/environmental-data", { data: { Year: year } });
      fetchEnvironmentalData();
    } catch (err) {
      setError("Failed to delete environmental data.");
    }
  };

  const handleUpdateData = async (updatedData: EnvironmentalData) => {
    try {
      // await axios.put("/panchayat-employee/environmental-data", updatedData);
      fetchEnvironmentalData();
    } catch (err) {
      setError("Failed to update environmental data.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Environmental Data Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Filter by Year</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        />
      </Form.Group>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Year</th>
              <th>AQI</th>
              <th>Forest Cover</th>
              <th>ODF</th>
              <th>Afforestation Data</th>
              <th>Precipitation</th>
              <th>Water Quality</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.Year}>
                <td>{entry.Year}</td>
                <td>{entry.Aqi}</td>
                <td>{entry.Forest_cover}</td>
                <td>{entry.Odf}</td>
                <td>{entry.Afforestation_data}</td>
                <td>{entry.Precipitation}</td>
                <td>{entry.Water_quality}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteData(entry.Year)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => handleUpdateData(entry)}
                  >
                    Edit
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

export default EmployeeEnvironment;

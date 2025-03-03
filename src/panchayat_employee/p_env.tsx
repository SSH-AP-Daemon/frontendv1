import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../AuthContext";
import { Button, Form, Table, Alert, Modal, Row, Col } from "react-bootstrap";

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
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [newData, setNewData] = useState<EnvironmentalData>({
    Year: new Date().getFullYear(),
    Aqi: 0,
    Forest_cover: 0,
    Odf: 0,
    Afforestation_data: 0,
    Precipitation: 0,
    Water_quality: 0
  });

  useEffect(() => {
    if (role !== "ENVIRONMENTAL_DATA") {
      setError("You are not authorized to manage environmental data.");
      setTimeout(() => {
        setError(null);
      }, 2000);
      setLoading(false);
      return;
    }
    fetchEnvironmentalData();
  }, [userName, role, yearFilter]);

  const fetchEnvironmentalData = async () => {
    try {
      setLoading(true);
      const params: { year?: string } = {};
      if (yearFilter) params.year = yearFilter;

      const response = await api.get("/panchayat-employee/environmental-data", { params });
      // let response = {
      //   data: {
      //     data: mockData.filter(
      //       (d) => !yearFilter || d.Year.toString() === yearFilter
      //     ),
      //   },
      // }; // Mock response
      setData(response.data.data);
    } catch (err) {
      setError("Failed to fetch environmental data.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddData = async (newData: EnvironmentalData) => {
    try {
      setFormSubmitting(true);
      await api.post("/panchayat-employee/environmental-data", newData);
      setShowAddModal(false);
      setNewData({
        Year: new Date().getFullYear(),
        Aqi: 0,
        Forest_cover: 0,
        Odf: 0,
        Afforestation_data: 0,
        Precipitation: 0,
        Water_quality: 0
      });
      fetchEnvironmentalData();
    } catch (err: any) {
      console.error("Error adding environmental data:", err);
      setError(err.response?.data?.detail || "Failed to add environmental data.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteData = async (year: number) => {
    try {
      await api.delete("/panchayat-employee/environmental-data", { data: { Year: year } });
      fetchEnvironmentalData();
    } catch (err) {
      setError("Failed to delete environmental data.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const handleUpdateData = async (updatedData: EnvironmentalData) => {
    try {
      // await axios.put("/panchayat-employee/environmental-data", updatedData);
      fetchEnvironmentalData();
    } catch (err) {
      setError("Failed to update environmental data.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewData(prevData => ({
      ...prevData,
      [name]: name === 'Year' ? parseInt(value) : parseFloat(value)
    }));
  };

  const handleAddFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddData(newData);
  };

  return (
    <div className="container mt-4">
      <h2>Environmental Data Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group className="mb-3" style={{ width: '200px' }}>
          <Form.Label>Filter by Year</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          />
        </Form.Group>
        
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          Add New Environmental Data
        </Button>
      </div>

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
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add New Environmental Data Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Environmental Data</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddFormSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="Year"
                    value={newData.Year}
                    onChange={handleInputChange}
                    required
                    min={1900}
                    max={2100}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Air Quality Index (AQI)</Form.Label>
                  <Form.Control
                    type="number"
                    name="Aqi"
                    value={newData.Aqi}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min={0}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Forest Cover (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="Forest_cover"
                    value={newData.Forest_cover}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min={0}
                    max={100}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Open Defecation Free (ODF) Rate (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="Odf"
                    value={newData.Odf}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min={0}
                    max={100}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Afforestation Data (hectares)</Form.Label>
                  <Form.Control
                    type="number"
                    name="Afforestation_data"
                    value={newData.Afforestation_data}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min={0}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precipitation (mm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="Precipitation"
                    value={newData.Precipitation}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min={0}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Water Quality Index</Form.Label>
                  <Form.Control
                    type="number"
                    name="Water_quality"
                    value={newData.Water_quality}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min={0}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={formSubmitting}
            >
              {formSubmitting ? "Submitting..." : "Add Environmental Data"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeEnvironment;
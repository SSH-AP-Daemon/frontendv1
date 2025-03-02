import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useAuth } from "../AuthContext";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";

// Sample test data
const sampleData = [
  {
    Financial_id: 1,
    year: 2023,
    Annual_Income: 50000,
    Income_source: "Salary",
    Tax_paid: 5000,
    Tax_liability: 2000,
    Debt_liability: 10000,
    Credit_score: 750,
    Last_updated: "2024-02-10T12:00:00Z",
  },
  {
    Financial_id: 2,
    year: 2022,
    Annual_Income: 70000,
    Income_source: "Business",
    Tax_paid: 7000,
    Tax_liability: 2500,
    Debt_liability: 5000,
    Credit_score: 800,
    Last_updated: "2024-02-11T14:30:00Z",
  },
];

const EmployeeFinance: React.FC = () => {
  const { userName, role } = useAuth();
  const [data, setData] = useState(sampleData);
  const [filteredData, setFilteredData] = useState(sampleData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for adding new financial data
  const [showModal, setShowModal] = useState(false);
  const [newData, setNewData] = useState({
    year: "",
    Annual_Income: "",
    Income_source: "",
    Tax_paid: "",
    Tax_liability: "",
    Debt_liability: "",
    Credit_score: "",
  });

  // Filters & Sorting
  const [searchYear, setSearchYear] = useState("");
  const [minIncome, setMinIncome] = useState("");
  const [maxIncome, setMaxIncome] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (role !== "FINANCIAL_DATA") {
      setError("You are not authorized to view financial data.");
      setLoading(false);
      return;
    }
    fetchFinancialData();
  }, [userName, role]);

  // Fetch financial data from API
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      // API CALL: Fetch financial data
      // const response = await axios.get(`/panchayat-employee/financial-data`, {
      //   params: { year: searchYear, user_name: userName },
      //   headers: { Authorization: `Bearer YOUR_JWT_TOKEN` },
      // });
      setData(sampleData); // Replace with response.data.data
      setFilteredData(sampleData);
    } catch (err) {
      setError("Failed to fetch financial data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search & filter
  useEffect(() => {
    let filtered = data;
    if (searchYear) {
      filtered = filtered.filter((item) => item.year.toString() === searchYear);
    }
    if (minIncome && maxIncome) {
      filtered = filtered.filter(
        (item) =>
          item.Annual_Income <= Number(minIncome) &&
          item.Annual_Income <= Number(maxIncome)
      );
    }
    if (sortOrder) {
      filtered.sort((a, b) =>
        sortOrder === "asc"
          ? a.Annual_Income - b.Annual_Income
          : b.Annual_Income - a.Annual_Income
      );
    }
    setFilteredData(filtered);
  }, [searchYear, minIncome, maxIncome, sortOrder, data]);

  // Handle create (POST request)
  const handleCreate = async () => {
    try {
      const payload = { ...newData, user_name: userName };
      // API CALL: Create new financial data
      // await axios.post("/panchayat-employee/financial-data", payload, {
      //   headers: { Authorization: `Bearer YOUR_JWT_TOKEN` },
      // });
      setShowModal(false);
      setNewData({
        year: "",
        Annual_Income: "",
        Income_source: "",
        Tax_paid: "",
        Tax_liability: "",
        Debt_liability: "",
        Credit_score: "",
      });
      fetchFinancialData();
    } catch (err) {
      setError("Failed to create financial data.");
    }
  };

  // Handle delete (DELETE request)
  const handleDelete = async (id: number) => {
    try {
      // API CALL: Delete financial data
      // await axios.delete("/panchayat-employee/financial-data", {
      //   data: { Financial_id: id },
      //   headers: { Authorization: `Bearer YOUR_JWT_TOKEN` },
      // });
      fetchFinancialData();
    } catch (err) {
      setError("Failed to delete financial data.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Financial Data</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        + Add Financial Data
      </Button>

      {/* Filters */}
      <Form className="mb-3 d-flex gap-3">
        <Form.Control
          type="number"
          placeholder="Year"
          onChange={(e) => setSearchYear(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="Min Income"
          onChange={(e) => setMinIncome(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="Max Income"
          onChange={(e) => setMaxIncome(e.target.value)}
        />
        <Form.Select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Sort by Income Ascending</option>
          <option value="desc">Sort by Income Descending</option>
        </Form.Select>
      </Form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Income</th>
              <th>Source</th>
              <th>Tax Paid</th>
              <th>Debt</th>
              <th>Credit Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.Financial_id}>
                <td>{index + 1}</td>
                <td>{item.year}</td>
                <td>{item.Annual_Income}</td>
                <td>{item.Income_source}</td>
                <td>{item.Tax_paid}</td>
                <td>{item.Debt_liability}</td>
                <td>{item.Credit_score}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item.Financial_id)}
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

export default EmployeeFinance;

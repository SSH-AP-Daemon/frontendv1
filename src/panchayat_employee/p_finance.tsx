import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Button, Form, Table, Modal, Alert } from "react-bootstrap";

// Define Types
// interface EmployeeFinanceProps {
//   userName: string;
//   role: string;
// }

interface FinancialData {
  Financial_id: number;
  year: number;
  Annual_Income: number;
  Income_source: string;
  Tax_paid: number;
  Tax_liability: number;
  Debt_liability: number;
  Credit_score: number;
}

const EmployeeFinance: React.FC = () => {
  const { userName, role } = useAuth();
  const [data, setData] = useState<FinancialData[]>([]);
  const [filteredData, setFilteredData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchYear, setSearchYear] = useState<string>("");

  const [minIncome, setMinIncome] = useState<string>("");
  const [maxIncome, setMaxIncome] = useState<string>("");
  const [minCreditScore, setMinCreditScore] = useState<string>("");
  const [maxDebtLiability, setMaxDebtLiability] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newData, setNewData] = useState<Partial<FinancialData>>({
    year: 0,
    Annual_Income: 0,
    Income_source: "",
    Tax_paid: 0,
    Tax_liability: 0,
    Debt_liability: 0,
    Credit_score: 0,
  });

  const mockData = [
    {
      Financial_id: 1,
      year: 2022,
      Annual_Income: 50000,
      Income_source: "Salary",
      Tax_paid: 5000,
      Tax_liability: 2000,
      Debt_liability: 10000,
      Credit_score: 750,
    },
    {
      Financial_id: 2,
      year: 2023,
      Annual_Income: 75000,
      Income_source: "Freelance",
      Tax_paid: 7000,
      Tax_liability: 3000,
      Debt_liability: 5000,
      Credit_score: 800,
    },
    {
      Financial_id: 3,
      year: 2024,
      Annual_Income: 120000,
      Income_source: "Investments",
      Tax_paid: 15000,
      Tax_liability: 5000,
      Debt_liability: 3000,
      Credit_score: 850,
    },
    {
      Financial_id: 4,
      year: 2022,
      Annual_Income: 40000,
      Income_source: "Business",
      Tax_paid: 4000,
      Tax_liability: 1500,
      Debt_liability: 15000,
      Credit_score: 680,
    },
  ];

  //   // Mock API call inside fetch function
  //   useEffect(() => {
  //     setTimeout(() => {
  //       setData(mockData);
  //       setFilteredData(mockData);
  //       setLoading(false);
  //     }, 1000); // Simulating API delay
  //   }, []);

  //   while (1) console.log(role);

  // Fetch Data from API
  useEffect(() => {
    if (role !== "FINANCIAL_DATA") {
      setError("You are not authorized to view financial data.");
      setLoading(false);
      return;
    }
    fetchFinancialData();
  }, [userName, role, searchYear]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const params: { year?: string; user_name: string } = {
        user_name: userName,
      };
      if (searchYear) params.year = searchYear;

      let response = { data: { data: mockData } };
      //   const response = await axios.get("/panchayat-employee/financial-data", {
      //     params,
      //   });
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (err) {
      setError("Failed to fetch financial data.");
    } finally {
      setLoading(false);
    }
  };

  // Apply Frontend Filters
  useEffect(() => {
    let filtered = [...data];

    if (minIncome) {
      filtered = filtered.filter(
        (item) => item.Annual_Income >= Number(minIncome)
      );
    }
    if (maxIncome) {
      filtered = filtered.filter(
        (item) => item.Annual_Income <= Number(maxIncome)
      );
    }
    if (minCreditScore) {
      filtered = filtered.filter(
        (item) => item.Credit_score >= Number(minCreditScore)
      );
    }
    if (maxDebtLiability) {
      filtered = filtered.filter(
        (item) => item.Debt_liability <= Number(maxDebtLiability)
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
  }, [minIncome, maxIncome, minCreditScore, maxDebtLiability, sortOrder, data]);

  // Create New Financial Data
  const handleCreate = async () => {
    try {
      await axios.post("/panchayat-employee/financial-data", {
        ...newData,
        user_name: userName,
      });
      setShowModal(false);
      fetchFinancialData();
    } catch (err) {
      setError("Failed to create financial data.");
    }
  };

  // Delete Financial Data
  const handleDelete = async (id: number) => {
    try {
      await axios.delete("/panchayat-employee/financial-data", {
        data: { Financial_id: id },
      });
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
        <Form.Control
          type="number"
          placeholder="Min Credit Score"
          onChange={(e) => setMinCreditScore(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="Max Debt Liability"
          onChange={(e) => setMaxDebtLiability(e.target.value)}
        />
        <Form.Select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Sort by Income Ascending</option>
          <option value="desc">Sort by Income Descending</option>
        </Form.Select>
      </Form>

      {/* Table */}
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

      {/* Modal for Adding Data */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Financial Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="number"
            placeholder="Year"
            onChange={(e) =>
              setNewData({ ...newData, year: Number(e.target.value) })
            }
          />
          <Button className="mt-3" onClick={handleCreate}>
            Add
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmployeeFinance;

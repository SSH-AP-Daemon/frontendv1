import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
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
  user_name: string;
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
  const [searchCitizen, setSearchCitizen] = useState<string>("");
  const [minIncome, setMinIncome] = useState<string>("");
  const [maxIncome, setMaxIncome] = useState<string>("");
  const [minCreditScore, setMinCreditScore] = useState<string>("");
  const [maxDebtLiability, setMaxDebtLiability] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newData, setNewData] = useState<Partial<FinancialData>>({
    year: 0,
    user_name: "",
    Annual_Income: 0,
    Income_source: "",
    Tax_paid: 0,
    Tax_liability: 0,
    Debt_liability: 0,
    Credit_score: 0,
  });

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
  }, [userName, role, searchYear, searchCitizen]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const params: { year?: string; user_name: string } = {
        user_name: searchCitizen,
      };
      if (searchYear) params.year = searchYear;

        const response = await api.get("/panchayat-employee/financial-data", {
          params,
        });
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
      await api.post("/panchayat-employee/financial-data", {
        ...newData
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
      await api.delete("/panchayat-employee/financial-data", {
        params: { Financial_id: id },
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
          type="string"
          placeholder="Citizen User Name"
          onChange={(e) => setSearchCitizen(e.target.value)}
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
          <Form.Control
            type="text"
            placeholder="Citizen User Name"
            onChange={(e) =>
              setNewData({ ...newData, user_name: e.target.value })
            }
          />
          <Form.Control
            type="number"
            placeholder="Annual Income"
            onChange={(e) =>
              setNewData({ ...newData, Annual_Income: Number(e.target.value) })
            }
          />
          <Form.Control
            type="text"
            placeholder="Income Source"
            onChange={(e) =>
              setNewData({ ...newData, Income_source: e.target.value })
            }
          />
          <Form.Control
            type="number"
            placeholder="Tax Paid"
            onChange={(e) =>
              setNewData({ ...newData, Tax_paid: Number(e.target.value) })
            }
          />
          <Form.Control
            type="number"
            placeholder="Tax Liability"
            onChange={(e) =>
              setNewData({ ...newData, Tax_liability: Number(e.target.value) })
            }
          />
          <Form.Control
            type="number"
            placeholder="Debt Liability"
            onChange={(e) =>
              setNewData({ ...newData, Debt_liability: Number(e.target.value) })
            }
          />
          <Form.Control
            type="number"
            placeholder="Credit Score"
            onChange={(e) =>
              setNewData({ ...newData, Credit_score: Number(e.target.value) })
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

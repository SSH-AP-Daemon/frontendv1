import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axiosConfig.tsx"; // Import API configuration

// Define interface for financial data structure
interface FinancialData {
  year: number;
  Annual_Income: number;
  Income_source: string;
  Tax_paid: number;
  Tax_liability: number;
  Debt_liability: number;
  Credit_score?: number;
  Last_updated: string;
}

const CitizenFinances: React.FC = () => {
  // State to store financial data
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  // State to handle loading state
  const [loading, setLoading] = useState<boolean>(true);
  // State to store error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        /**
         * Uncomment below API call when backend is ready for testing.
         * It will fetch actual financial data from the backend.
         */

        const response = await api.get("/citizen/financial-data");

        // Mocked API Response (Replace with real API response for testing)
        // const response = {
        //   data: {
        //     statusCode: 200,
        //     message: "Financial data fetched successfully",
        //     data: [
        //       {
        //         year: 2023,
        //         Annual_Income: 75000.0,
        //         Income_source: "Software Engineer",
        //         Tax_paid: 5000.0,
        //         Tax_liability: 6000.0,
        //         Debt_liability: 10000.0,
        //         Credit_score: 750,
        //         Last_updated: "2024-02-20 14:30:00",
        //       },
        //       {
        //         year: 2022,
        //         Annual_Income: 70000.0,
        //         Income_source: "Software Engineer",
        //         Tax_paid: 4500.0,
        //         Tax_liability: 5500.0,
        //         Debt_liability: 12000.0,
        //         Credit_score: 730,
        //         Last_updated: "2023-02-15 12:15:00",
        //       },
        //     ],
        //   },
        // };

        // Handling API response
        if (response.data.statusCode === 200) {
          setFinancialData(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch financial data.");
        }
      } catch (err) {
        setError("Error fetching financial data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Financial Data</h2>

      {/* Show loading spinner while fetching data */}
      {loading && <Spinner animation="border" className="d-block mx-auto" />}

      {/* Show error message if fetching fails */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Show financial data if available */}
      {!loading && !error && financialData.length > 0 && (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Year</th>
              <th>Annual Income</th>
              <th>Income Source</th>
              <th>Tax Paid</th>
              <th>Tax Liability</th>
              <th>Debt Liability</th>
              <th>Credit Score</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {financialData.map((data, index) => (
              <tr key={index}>
                <td>{data.year}</td>
                <td>₹ {data.Annual_Income.toLocaleString()}</td>
                <td>{data.Income_source}</td>
                <td>₹ {data.Tax_paid.toLocaleString()}</td>
                <td>₹ {data.Tax_liability.toLocaleString()}</td>
                <td>₹ {data.Debt_liability.toLocaleString()}</td>
                <td>{data.Credit_score || "N/A"}</td>
                <td>{new Date(data.Last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Show message if no financial data is available */}
      {!loading && !error && financialData.length === 0 && (
        <Alert variant="info">No financial data available.</Alert>
      )}
    </Container>
  );
};

export default CitizenFinances;

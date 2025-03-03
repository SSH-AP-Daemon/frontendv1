// import { Stack } from "react-bootstrap";
import { Button, Table, Container, Row, Col, Card, Stack } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import api from "../api/axiosConfig.tsx";


type Census = {
  year: number;
  total: number;
  male: number;
  female: number;
  literacy: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const censusData = [
  { year: 2000, population: 50 },
  { year: 2010, population: 65 },
  { year: 2020, population: 80 },
];

const censusPieData = [
  { name: "2000", value: 50 },
  { name: "2010", value: 65 }, 
  { name: "2020", value: 80 },
];

const envData = [
  { year: 2000, aqi: 90 },
  { year: 2010, aqi: 75 },
  { year: 2020, aqi: 60 },
];

export default function Home() {

  const [error, setError] = useState<string | null>(null);
  const [census, setCensus] = useState<Census[]>([]);
  const [newCensus, setNewCensus] = useState<Census>({
    year: 0,
    total: 0,
    male: 0,
    female: 0,
    literacy: 0,
  });
  

  const fetchCensusData = async () => {
    try {
      const response = await api.get("/census");
      setCensus(response.data);
    } catch (err) {
      setError("Failed to fetch census data.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };
  
  return (
    <>
      <Container fluid className="text-center main-container">
        <Stack>
          <h3>Welcome to </h3>
          <h1>SSH AP Daemon Village</h1>
          <h2></h2>
          <h3>Environmental Data</h3>
          <Row className="mt-4" noGutters gap={2}>
            <Col>
              <Card className="chart-card">
                <Card.Body>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={envData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="aqi"
                        stroke="#ff4d4d"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>

            <Col className="pie-chart-container">
              <Card className="chart-card">
                <Card.Body>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={envData}
                        dataKey="year"
                        nameKey="population"
                        outerRadius={100}
                        fill="#82ca9d"
                        label
                      >
                        {envData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          
          <h2>Census Data</h2>

          {/* Line Chart Visualization */}
          <h2>Year-wise Census Trends</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={census} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="year" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Population" />
              <Line type="monotone" dataKey="male" stroke="#82ca9d" name="Male Population" />
              <Line type="monotone" dataKey="female" stroke="#ff7300" name="Female Population" />
              <Line type="monotone" dataKey="literacy" stroke="#ff0000" name="Literacy Rate (%)" />
            </LineChart>
          </ResponsiveContainer>
          {/* Table to show census data */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Population</th>
                <th>Male</th>
                <th>Female</th>
                <th>Literacy Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {census.map((entry) => (
                <tr key={entry.year}>
                  <td>{entry.year}</td>
                  <td>{entry.total}</td>
                  <td>{entry.male}</td>
                  <td>{entry.female}</td>
                  <td>{entry.literacy}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>
      </Container>
    </>
  );
}

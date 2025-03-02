// import { Stack } from "react-bootstrap";
import { Container, Row, Col, Card, Stack } from "react-bootstrap";
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

          <h3>Census Data</h3>
          <Row className="mt-4" noGutters gap={2}>
            <Col>
              <Card className="chart-card">
                <Card.Body>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={censusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="population"
                        stroke="#007bff"
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
                        data={censusPieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {censusPieData.map((_, index) => (
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
        </Stack>
      </Container>
    </>
  );
}

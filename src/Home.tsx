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

type EnvData = {
  year: number;
  aqi: number;
  forestCover: number;
  odf: number;
  afforestation: number;
  precipitation: number;
  waterQuality: number;
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
  const [env, setEnv] = useState<EnvData[]>([]);

  useEffect(() => {
    fetchCensusData();
    fetchEnvData();
  }, []);

  const fetchEnvData = async () => {
    try {
      const response = await api.get("user/environmental-data");
      console.log("Environmental data response:", response.data);

      // Access the nested data array from the response
      const envDataArray = response.data.data || [];

      const transformedData = envDataArray.map((item: any) => ({
        year: item.Year,
        aqi: item.Aqi,
        forestCover: item.Forest_cover,
        odf: item.Odf,
        afforestation: item.Afforestation_data,
        precipitation: item.Precipitation,
        waterQuality: item.Water_quality,
      }));

      setEnv(transformedData);
    } catch (err) {
      console.error("Env data fetch error:", err);
      setError("Failed to fetch environmental data.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const fetchCensusData = async () => {
    try {
      const response = await api.get("user/census");
      console.log("Census data response:", response.data);

      // Handle both direct array response or nested data object
      const censusDataArray = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);

      const transformedData = censusDataArray.map((item: any) => ({
        year: item.Year,
        total: item.TotalPopulation,
        male: item.MalePopulation,
        female: item.FemalePopulation,
        literacy: item.LiteracyRate,
      }));

      setCensus(transformedData);
    } catch (err) {
      console.error("Census data fetch error:", err);
      setError("Failed to fetch census data.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  return (
    <Container fluid className="text-center main-container">
      <Stack>
        <h3>Welcome to</h3>
        <h1>SSH AP Daemon Village</h1>

        {/* Error message display */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Environmental Data Section */}
        <h2>Environmental Data</h2>
        {env.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={env} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="year" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="aqi" stroke="#ff4d4d" name="AQI" />
              <Line type="monotone" dataKey="forestCover" stroke="#228B22" name="Forest Cover (%)" />
              <Line type="monotone" dataKey="odf" stroke="#FF1493" name="ODF (%)" />
              <Line type="monotone" dataKey="afforestation" stroke="#8A2BE2" name="Afforestation (hectares)" />
              <Line type="monotone" dataKey="precipitation" stroke="#1E90FF" name="Precipitation (mm)" />
              <Line type="monotone" dataKey="waterQuality" stroke="#32CD32" name="Water Quality Index" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No environmental data available</p>
        )}

        {/* Environmental Data Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Year</th>
              <th>AQI</th>
              <th>Forest Cover (%)</th>
              <th>ODF (%)</th>
              <th>Afforestation (hectares)</th>
              <th>Precipitation (mm)</th>
              <th>Water Quality Index</th>
            </tr>
          </thead>
          <tbody>
            {env.length > 0 ? (
              env.map((entry) => (
                <tr key={entry.year}>
                  <td>{entry.year}</td>
                  <td>{entry.aqi}</td>
                  <td>{entry.forestCover}</td>
                  <td>{entry.odf}</td>
                  <td>{entry.afforestation}</td>
                  <td>{entry.precipitation}</td>
                  <td>{entry.waterQuality}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No environmental data available</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Census Data Section */}
        <h2>Census Data</h2>
        {census.length > 0 ? (
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
        ) : (
          <p>No census data available</p>
        )}

        {/* Census Data Table */}
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
            {census.length > 0 ? (
              census.map((entry) => (
                <tr key={entry.year}>
                  <td>{entry.year}</td>
                  <td>{entry.total}</td>
                  <td>{entry.male}</td>
                  <td>{entry.female}</td>
                  <td>{entry.literacy}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No census data available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Stack>
    </Container>
  );
}
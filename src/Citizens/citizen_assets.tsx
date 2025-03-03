import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axiosConfig.tsx";

interface Asset {
  type: string;
  valuation: string;
  Year?: number;
  Season?: string;
  Crop_type?: string;
  Area_cultivated?: number;
  Yield?: number;
}

const CitizenAssets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get("/citizen/assets");
        console.log(response);
        // const response = {
        //   data: {
        //     statusCode: 200,
        //     message: "Assets fetched successfully",
        //     data: [
        //       {
        //         type: "house",
        //         valuation: "$150,000",
        //       },
        //       {
        //         type: "agricultural_land",
        //         valuation: "$50,000",
        //         Year: 2024,
        //         Season: "Summer",
        //         Crop_type: "Wheat",
        //         Area_cultivated: 4.5,
        //         Yield: 7.2,
        //       },
        //       {
        //         type: "car",
        //         valuation: "$20,000",
        //       },
        //       {
        //         type: "agricultural_land",
        //         valuation: "$80,000",
        //         Year: 2023,
        //         Season: "Winter",
        //         Crop_type: "Rice",
        //         Area_cultivated: 3.2,
        //         Yield: 6.8,
        //       },
        //     ],
        //   },
        // };
        if (response.data.statusCode === 200) {
          setAssets(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch assets");
          setTimeout(() => {
            setError(null);
          }, 2000);
        }
      } catch (err: any) {
        setError("Error fetching assets. Please try again.");
        setTimeout(() => {
          setError(null);
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Citizen Assets</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && assets.length === 0 && (
        <Alert variant="info">No assets available.</Alert>
      )}

      {!loading && !error && assets.length > 0 && (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Type</th>
              <th>Valuation</th>
              <th>Year</th>
              <th>Season</th>
              <th>Crop Type</th>
              <th>Area Cultivated</th>
              <th>Yield</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={index}>
                <td>{asset.type}</td>
                <td>{asset.valuation}</td>
                <td>
                  {asset.type === "agricultural_land"
                    ? asset.Year || "N/A"
                    : "N/A"}
                </td>
                <td>
                  {asset.type === "agricultural_land"
                    ? asset.Season || "N/A"
                    : "N/A"}
                </td>
                <td>
                  {asset.type === "agricultural_land"
                    ? asset.Crop_type || "N/A"
                    : "N/A"}
                </td>
                <td>
                  {asset.type === "agricultural_land"
                    ? asset.Area_cultivated || "N/A"
                    : "N/A"}
                </td>
                <td>
                  {asset.type === "agricultural_land"
                    ? asset.Yield || "N/A"
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CitizenAssets;

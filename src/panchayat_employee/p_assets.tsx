import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../AuthContext";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";

interface Asset {
  Asset_id: number;
  Type: string;
  Valuation: number;
  User_name: string;
}

const EmployeeAssets: React.FC = () => {
  const { userName, role } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [citizen, setCitizen] = useState<string | null>(null);
  const [searchCitizen, setSearchCitizen] = useState<string | null>(null);

  // State for create/edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [newAsset, setNewAsset] = useState({ Type: "", Valuation: 0 });

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [minValuation, setMinValuation] = useState<number | "">("");
  const [maxValuation, setMaxValuation] = useState<number | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  useEffect(() => {
    if (role !== "ASSET") {
      setError("You are not authorized to manage assets.");
      setLoading(false);
      // clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
    fetchAssets();
  }, [userName, role, searchCitizen]);

  // Fetch assets
  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/panchayat-employee/assets/${searchCitizen}`
      );

      // let response = { data: { data: sampleAssets } };
      setAssets(response.data);
      setFilteredAssets(response.data); // Initially, filtered list = all assets
    } catch (err) {
      setError("Failed to fetch assets.");
      setTimeout(() => {
        setError(null);
      }, 2000);
      setAssets([]);
      setFilteredAssets([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    let filtered = assets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((asset) =>
        asset.Type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Valuation filter
    if (minValuation !== "" && maxValuation !== "") {
      filtered = filtered.filter(
        (asset) =>
          asset.Valuation >= minValuation && asset.Valuation <= maxValuation
      );
    }

    // Sorting
    if (sortOrder) {
      filtered = [...filtered].sort((a, b) =>
        sortOrder === "asc"
          ? a.Valuation - b.Valuation
          : b.Valuation - a.Valuation
      );
    }

    setFilteredAssets(filtered);
  }, [searchTerm, minValuation, maxValuation, sortOrder, assets]);

  // Create or update asset
  const handleSaveAsset = async () => {
    try {
      const payload = {
        Type: newAsset.Type,
        Valuation: newAsset.Valuation,
        User_name: citizen,
      };

      if (editingAsset) {
        await api.put(`/panchayat-employee/assets/${editingAsset.Asset_id}`, payload);
      } else {
        await api.post("/panchayat-employee/assets", payload);
      }

      setShowModal(false);
      setEditingAsset(null);
      setNewAsset({ Type: "", Valuation: 0 });
      fetchAssets();
    } catch (err) {
      setError("Failed to save asset.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  // Delete asset
  const handleDeleteAsset = async (assetId: number) => {
    try {
      await api.delete(`/panchayat-employee/assets/${assetId}`);
      fetchAssets();
    } catch (err) {
      setError("Failed to delete asset.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Assets</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        + Add Asset
      </Button>

      {/* Search & Filter */}
      <Form className="mb-3 d-flex gap-3">
        <Form.Control
          type="text"
          placeholder="Search by user name"
          value={searchCitizen?.toString() ?? ""}
          onChange={(e) => setSearchCitizen(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Search by Type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="Min Valuation"
          value={minValuation}
          onChange={(e) =>
            setMinValuation(e.target.value ? parseFloat(e.target.value) : "")
          }
        />
        <Form.Control
          type="number"
          placeholder="Max Valuation"
          value={maxValuation}
          onChange={(e) =>
            setMaxValuation(e.target.value ? parseFloat(e.target.value) : "")
          }
        />
        <Form.Select
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "")}
        >
          <option value="">Sort by Valuation</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Form.Select>
      </Form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Valuation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset, index) => (
              <tr key={asset.Asset_id}>
                <td>{index + 1}</td>
                <td>{asset.Type}</td>
                <td>{asset.Valuation}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setEditingAsset(asset);
                      setNewAsset({
                        Type: asset.Type,
                        Valuation: asset.Valuation,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteAsset(asset.Asset_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAsset ? "Edit Asset" : "Add Asset"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Asset Type</Form.Label>
              <Form.Control
                type="text"
                value={newAsset.Type}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, Type: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Citizen User Name</Form.Label>
              <Form.Control
                type="text"
                value={citizen?.toString() ?? ""}
                onChange={(e) =>
                  setCitizen(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Valuation</Form.Label>
              <Form.Control
                type="number"
                value={newAsset.Valuation}
                onChange={(e) =>
                  setNewAsset({
                    ...newAsset,
                    Valuation: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSaveAsset}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeAssets;

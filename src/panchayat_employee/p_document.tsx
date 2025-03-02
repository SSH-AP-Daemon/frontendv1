import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";

// Dummy Data for Testing
const sampleDocuments = [
  { Doc_id: 1, Type: "Aadhar", user_name: "john_doe" },
  { Doc_id: 2, Type: "PAN", user_name: "jane_doe" },
  { Doc_id: 3, Type: "Voter ID", user_name: "john_doe" },
];

interface Document {
  Doc_id: number;
  Type: string;
  user_name: string;
}

const EmployeeDocuments: React.FC = () => {
  const { userName, role } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [newDocument, setNewDocument] = useState<{
    Type: string;
    file: File | null;
  }>({
    Type: "",
    file: null,
  });
  const [searchType, setSearchType] = useState(""),
    [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    if (role !== "DOCUMENT") {
      setError("You are not authorized to manage documents.");
      setLoading(false);
      return;
    }
    fetchDocuments();
  }, [userName, role]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // const response = await axios.get(`/panchayat-employee/document`, {
      //   headers: { Authorization: `Bearer YOUR_JWT_TOKEN` },
      //   params: { user_name: userName },
      // });
      let response = { data: { data: sampleDocuments } };
      setDocuments(response.data.data);
      setFilteredDocuments(response.data.data);
    } catch (err) {
      setError("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = documents;
    if (searchType) {
      filtered = filtered.filter((doc) =>
        doc.Type.toLowerCase().includes(searchType.toLowerCase())
      );
    }
    if (searchUser) {
      filtered = filtered.filter((doc) =>
        doc.user_name.toLowerCase().includes(searchUser.toLowerCase())
      );
    }
    setFilteredDocuments(filtered);
  }, [searchType, searchUser, documents]);

  const handleSaveDocument = async () => {
    try {
      const formData = new FormData();
      formData.append("Type", newDocument.Type);
      formData.append("user_name", userName);
      if (newDocument.file) {
        formData.append("Pdf_data", newDocument.file);
      }

      if (editingDocument) {
        await axios.put("/panchayat-employee/document", formData, {
          headers: { Authorization: `Bearer YOUR_JWT_TOKEN` },
        });
      } else {
        await axios.post("/panchayat-employee/document", formData, {
          headers: { Authorization: `Bearer YOUR_JWT_TOKEN` },
        });
      }
      setShowModal(false);
      setEditingDocument(null);
      setNewDocument({ Type: "", file: null });
      fetchDocuments();
    } catch (err) {
      setError("Failed to save document.");
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      await axios.delete("/panchayat-employee/document", {
        data: { doc_id: docId },
        headers: { Authorization: `Bearer YOUR_JWT_TOKEN` },
      });
      fetchDocuments();
    } catch (err) {
      setError("Failed to delete document.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Documents</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowModal(true)}
      >
        + Add Document
      </Button>
      <Form className="mb-3 d-flex gap-3">
        <Form.Control
          type="text"
          placeholder="Search by Type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Search by User"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
      </Form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, index) => (
              <tr key={doc.Doc_id}>
                <td>{index + 1}</td>
                <td>{doc.Type}</td>
                <td>{doc.user_name}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteDocument(doc.Doc_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDocument ? "Edit Document" : "Add Document"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Document Type</Form.Label>
              <Form.Control
                type="text"
                value={newDocument.Type}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, Type: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Upload PDF</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setNewDocument((prev) => ({ ...prev, file }));
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSaveDocument}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeDocuments;

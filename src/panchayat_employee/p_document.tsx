import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../AuthContext";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";

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
  const [newDocument, setNewDocument] = useState<{ Type: string; citizenUserName: string; file: File | null }>({
    Type: "",
    citizenUserName: "",
    file: null,
  });
  const [searchType, setSearchType] = useState("");
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    if (role !== "DOCUMENT") {
      setError("You are not authorized to manage documents.");
      setLoading(false);
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
  }, [userName, role, searchUser]); // Fetch documents when searchUser changes

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/panchayat-employee/documents/${searchUser}`); // Apply user filter in API call
      setDocuments(response.data.data);
      setFilteredDocuments(response.data.data); // Set filtered docs initially
    } catch (err) {
      setError("Failed to fetch documents.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndFilterDocuments = async () => {
      await fetchDocuments(); // Wait for data to be fetched
      console.log("Documents:", documents);
      console.log(filteredDocuments);
  
      // Filtering happens after documents are updated
      // let filtered = documents;
  
      // if (searchUser) {
      //   filtered = filtered.filter((doc) =>
      //     doc.user_name.toLowerCase().includes(searchUser.toLowerCase())
      //   );
      // }
  
      // if (searchType) {
      //   filtered = filtered.filter((doc) =>
      //     doc.Type.toLowerCase().includes(searchType.toLowerCase())
      //   );
      // }
  
      // setFilteredDocuments(filtered);
    };
  
    fetchAndFilterDocuments();
  }, [searchType, searchUser]); // Dependencies for re-execution
  

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveDocument = async () => {
    try {
      if (!newDocument.file) {
        setError("Please select a file to upload.");
        setTimeout(() => {
          setError(null);
        }, 2000)
        return;
      }
      const base64String = await fileToBase64(newDocument.file);
      const payload = {
        Type: newDocument.Type,
        user_name: newDocument.citizenUserName,
        pdf_data: base64String,
      };

      if (editingDocument) {
        await api.put("/panchayat-employee/documents", payload);
      } else {
        await api.post("/panchayat-employee/documents", payload);
      }

      setShowModal(false);
      setEditingDocument(null);
      setNewDocument({ Type: "", citizenUserName: "", file: null });
      fetchDocuments();
    } catch (err) {
      setError("Failed to save document.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      await api.delete(`/panchayat-employee/documents/${docId}`);
      fetchDocuments();
    } catch (err) {
      setError("Failed to delete document.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Documents</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
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
          onBlur={fetchDocuments} // Fetch new data when user exits the input field
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
            {Array.isArray(filteredDocuments) ? (
              filteredDocuments.map((doc, index) => (
                <tr key={doc.Doc_id}>
                  <td>{index + 1}</td>
                  <td>{doc.Type}</td>
                  <td>{doc.user_name}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteDocument(doc.Doc_id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No documents available.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingDocument ? "Edit Document" : "Add Document"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Document Type</Form.Label>
              <Form.Control
                type="text"
                value={newDocument.Type}
                onChange={(e) => setNewDocument({ ...newDocument, Type: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Citizen User Name</Form.Label>
              <Form.Control
                type="text"
                value={newDocument.citizenUserName}
                onChange={(e) => setNewDocument({ ...newDocument, citizenUserName: e.target.value })}
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
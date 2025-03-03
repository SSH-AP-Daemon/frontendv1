import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../AuthContext";
import { Table, Button, Form, Modal, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, DownloadCloud, Plus } from "lucide-react";

interface Document {
  Document_id: number;
  Type: string;
  Pdf_data: string;
  Citizen_id: number;
  user_name: string;
}

const EmployeeDocuments: React.FC = () => {
  const { userName, role } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  const [newDocument, setNewDocument] = useState<{ Type: string; citizenUserName: string; file: File | null }>({
    Type: "",
    citizenUserName: "",
    file: null,
  });
  const [searchType, setSearchType] = useState("");
  const [searchUser, setSearchUser] = useState("");

  // Check authorization
  useEffect(() => {
    if (role !== "PANCHAYAT_EMPLOYEE") {
      setError("You are not authorized to manage documents.");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [role]);

  const fetchDocuments = async () => {
    // Don't fetch if no username is provided
    if (!searchUser.trim()) {
      setDocuments([]);
      setFilteredDocuments([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/panchayat-employee/documents/${searchUser.trim()}`);
      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setDocuments(response.data.data);
        
        // Apply type filter if provided
        if (searchType.trim()) {
          const filtered = response.data.data.filter((doc: Document) => 
            doc.Type.toLowerCase().includes(searchType.toLowerCase())
          );
          setFilteredDocuments(filtered);
        } else {
          setFilteredDocuments(response.data.data);
        }
      } else {
        setDocuments([]);
        setFilteredDocuments([]);
        console.warn("Invalid data format received from API");
      }
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      setError(err.response?.data?.detail || "Failed to fetch documents.");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents when username changes and not empty
  useEffect(() => {
    if (searchUser.trim()) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setFilteredDocuments([]);
    }
  }, [searchUser]);
  
  // Filter documents by type without fetching again
  useEffect(() => {
    if (documents.length === 0) return;
    
    if (searchType.trim()) {
      const filtered = documents.filter(doc => 
        doc.Type.toLowerCase().includes(searchType.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents);
    }
  }, [searchType, documents]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveDocument = async () => {
    try {
      if (!newDocument.file) {
        setError("Please select a file to upload.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      
      if (!newDocument.Type.trim()) {
        setError("Please enter a document type.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      
      if (!newDocument.citizenUserName.trim()) {
        setError("Please enter a citizen username.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      
      setLoading(true);
      const base64String = await fileToBase64(newDocument.file);
      const payload = {
        Type: newDocument.Type.trim(),
        user_name: newDocument.citizenUserName.trim(),
        pdf_data: base64String,
      };

      await api.post("/panchayat-employee/documents", payload);
      
      setShowModal(false);
      setNewDocument({ Type: "", citizenUserName: "", file: null });
      
      // Refresh documents if we're showing this user's documents
      if (newDocument.citizenUserName.trim() === searchUser.trim()) {
        fetchDocuments();
      }
      
    } catch (err: any) {
      console.error("Error saving document:", err);
      setError(err.response?.data?.detail || "Failed to save document.");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/panchayat-employee/documents/${docId}`);
      fetchDocuments();
    } catch (err: any) {
      console.error("Error deleting document:", err);
      setError(err.response?.data?.detail || "Failed to delete document.");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = (pdfBase64: string) => {
    setPreviewPdf(`data:application/pdf;base64,${pdfBase64}`);
  };

  const handleDownload = (doc: Document) => {
    try {
      const byteCharacters = atob(doc.Pdf_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${doc.Type}-${doc.user_name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error downloading document:", err);
      setError("Failed to download document.");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Document Management</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3" style={{ width: "70%" }}>
          <Form.Control
            type="text"
            placeholder="Enter citizen username to search documents"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="Filter by document type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          />
        </div>
        
        <Button 
          variant="primary" 
          onClick={() => setShowModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <Plus size={16} /> Add Document
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading documents...</p>
        </div>
      ) : (
        <>
          {!searchUser.trim() ? (
            <Alert variant="info">Enter a citizen username to view their documents</Alert>
          ) : filteredDocuments.length === 0 ? (
            <Alert variant="info">No documents found for this user or filter criteria</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Document Type</th>
                  <th>Citizen Username</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc, index) => (
                  <tr key={doc.Document_id}>
                    <td>{index + 1}</td>
                    <td>{doc.Type}</td>
                    <td>{doc.user_name}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Preview</Tooltip>}
                        >
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewPdf(doc.Pdf_data)}
                          >
                            <Eye size={16} />
                          </Button>
                        </OverlayTrigger>
                        
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Download</Tooltip>}
                        >
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <DownloadCloud size={16} />
                          </Button>
                        </OverlayTrigger>
                        
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Delete</Tooltip>}
                        >
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.Document_id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      {/* Upload Document Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload New Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Document Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter document type (e.g., Aadhar Card, PAN Card)"
                value={newDocument.Type}
                onChange={(e) => setNewDocument({ ...newDocument, Type: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Citizen Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter citizen's username"
                value={newDocument.citizenUserName}
                onChange={(e) => setNewDocument({ ...newDocument, citizenUserName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>PDF Document</Form.Label>
              <Form.Control
                type="file"
                accept="application/pdf"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setNewDocument({ ...newDocument, file });
                }}
              />
              <Form.Text className="text-muted">
                Only PDF files are supported
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveDocument} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Uploading...
              </>
            ) : (
              "Upload Document"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* PDF Preview Modal */}
      <Modal
        show={!!previewPdf}
        onHide={() => setPreviewPdf(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Document Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewPdf && (
            <iframe
              src={previewPdf}
              title="PDF Preview"
              width="100%"
              height="500px"
              style={{ border: "none" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmployeeDocuments;
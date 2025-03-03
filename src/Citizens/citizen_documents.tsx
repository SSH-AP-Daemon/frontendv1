import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Modal,
  Alert,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { Eye, DownloadCloud, FileText } from "lucide-react";
import api from "../../api/axiosConfig.tsx";

interface Document {
  Document_id: number;
  Type: string;
  Pdf_data: string; // Base64 encoded PDF
}

const CitizenDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        console.log("Fetching citizen documents...");
        const response = await api.get("/citizen/document");
        console.log("Document response:", response.data);

        if (response.data.statusCode === 200 && Array.isArray(response.data.data)) {
          setDocuments(response.data.data);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setError(response.data.message || "Failed to fetch documents.");
          setTimeout(() => {
            setError(null);
          }, 3000);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Error fetching documents. Please try again.");
        setTimeout(() => {
          setError(null);
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

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
      link.download = `${doc.Type}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error downloading document:", err);
      setError("Failed to download document");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handlePreview = (doc: Document) => {
    setPreviewPdf(`data:application/pdf;base64,${doc.Pdf_data}`);
  };

  return (
    <Container className="my-4">
      <div className="d-flex align-items-center mb-4">
        <FileText className="text-primary me-2" size={24} />
        <h2 className="mb-0">My Documents</h2>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <Alert variant="info">
          <div className="d-flex align-items-center">
            <FileText className="text-info me-2" size={20} />
            <span>You don't have any documents yet. Contact your panchayat employee to upload documents.</span>
          </div>
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Document Type</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc.Document_id || index}>
                <td>{index + 1}</td>
                <td>{doc.Type}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Preview Document</Tooltip>}
                    >
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handlePreview(doc)}
                        className="d-flex align-items-center gap-1"
                      >
                        <Eye size={16} /> View
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Download Document</Tooltip>}
                    >
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        className="d-flex align-items-center gap-1"
                      >
                        <DownloadCloud size={16} /> Download
                      </Button>
                    </OverlayTrigger>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

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
        <Modal.Body className="p-0">
          {previewPdf && (
            <iframe
              src={previewPdf}
              title="PDF Preview"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreviewPdf(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CitizenDocuments;
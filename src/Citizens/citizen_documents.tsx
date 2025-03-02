import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Modal,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
// import api from "../api/axiosConfig.tsx";
import { Eye, DownloadCloud } from "lucide-react";
import api from "../../api/axiosConfig.tsx";

interface Document {
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
        const response = await api.get("/citizen/document");

        if (response.data.statusCode === 200) {
          setDocuments(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch documents.");
        }
      } catch (err) {
        setError("Error fetching documents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDownload = (doc: Document) => {
    const byteCharacters = atob(doc.Pdf_data);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${doc.Type}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePreview = (doc: Document) => {
    setPreviewPdf(`data:application/pdf;base64,${doc.Pdf_data}`);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Citizen Documents</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && documents.length > 0 && (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Document Type</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{doc.Type}</td>
                <td className="text-center">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Download</Tooltip>}
                  >
                    <span>
                      <DownloadCloud
                        className="text-success mx-2 cursor-pointer"
                        size={20}
                        onClick={() => handleDownload(doc)}
                        aria-label="Download"
                      />
                    </span>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Preview</Tooltip>}
                  >
                    <span>
                      <Eye
                        className="text-primary mx-2 cursor-pointer"
                        size={20}
                        onClick={() => handlePreview(doc)}
                        aria-label="Preview"
                      />
                    </span>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {!loading && !error && documents.length === 0 && (
        <Alert variant="info">No documents available.</Alert>
      )}

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
    </Container>
  );
};

export default CitizenDocuments;

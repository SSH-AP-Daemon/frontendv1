import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useAuth } from "../AuthContext";
import { Button, Form, Table, Alert } from "react-bootstrap";
import api from "../../api/axiosConfig";

// Define Types
interface WelfareScheme {
  Scheme_id: number;
  Scheme_name: string;
  Description: string;
  Application_deadline: string;
}

interface Enrollment {
  Citizen_fk: number;
  user_name: string;
  Scheme_fk: number;
  scheme_name: string;
  status: string;
}

const EmployeeWelfScheme: React.FC = () => {
  const { userName, role } = useAuth();
  const [schemes, setSchemes] = useState<WelfareScheme[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchScheme, setSearchScheme] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");

  useEffect(() => {
    if (role !== "WELFARE_SCHEME") {
      setError("You are not authorized to manage welfare schemes.");
      setLoading(false);
      return;
    }
    fetchSchemes();
    fetchEnrollments();
  }, [userName, role, searchScheme, searchStatus]);

  // Mock Data for Welfare Schemes
  const mockSchemes: WelfareScheme[] = [
    {
      Scheme_id: 1,
      Scheme_name: "Health Assistance Program",
      Description:
        "Provides financial aid for medical expenses to eligible citizens.",
      Application_deadline: "2025-06-30",
    },
    {
      Scheme_id: 2,
      Scheme_name: "Education Grant",
      Description: "Offers scholarships to students from low-income families.",
      Application_deadline: "2025-12-31",
    },
    {
      Scheme_id: 3,
      Scheme_name: "Housing Support Scheme",
      Description: "Assists families in constructing or repairing their homes.",
      Application_deadline: "2026-03-15",
    },
    {
      Scheme_id: 4,
      Scheme_name: "Agricultural Subsidy",
      Description:
        "Provides financial support to farmers for seeds and fertilizers.",
      Application_deadline: "2025-09-10",
    },
  ];

  // Mock Data for Enrollments (Different from Schemes)
  const mockEnrollments: Enrollment[] = [
    {
      Citizen_fk: 101,
      user_name: "John Doe",
      Scheme_fk: 1,
      scheme_name: "Health Assistance Program",
      status: "PENDING",
    },
    {
      Citizen_fk: 102,
      user_name: "Alice Smith",
      Scheme_fk: 2,
      scheme_name: "Education Grant",
      status: "APPROVED",
    },
    {
      Citizen_fk: 103,
      user_name: "Robert Johnson",
      Scheme_fk: 3,
      scheme_name: "Housing Support Scheme",
      status: "REJECTED",
    },
    {
      Citizen_fk: 104,
      user_name: "Emily Brown",
      Scheme_fk: 4,
      scheme_name: "Agricultural Subsidy",
      status: "PENDING",
    },
  ];

  // Fetch Schemes
  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params: { scheme_name?: string } = {};
      if (searchScheme) params.scheme_name = searchScheme;

      // Mock API response (for testing)
      // let response = { data: { data: mockSchemes } };
      
      // Uncomment this when integrating with backend:
      const response = await api.get("/panchayat-employee/welfare-schemes");
      setSchemes(response.data.data);
      console.log(response.data.data);
      // setSchemes(response.data.data);
    } catch (err) {
      setError("Failed to fetch welfare schemes.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Enrollments
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const params: { scheme_name?: string; status?: string } = {};
      if (searchScheme) params.scheme_name = searchScheme;
      if (searchStatus) params.status = searchStatus;

      // Uncomment this when integrating with backend:
      const response = await api.get("/panchayat-employee/welfare-enrol");
      setEnrollments(response.data.data);
    } catch (err) {
      setError("Failed to fetch enrollments.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    schemeId: number,
    citizenId: number,
    newStatus: string
  ) => {
    try {
      // Mock API request (for testing)
      console.log(`Updating status: ${newStatus} for Citizen ${citizenId}`);

      // Uncomment this when integrating with backend:
      await api.put("/panchayat-employee/welfare-enrol", {
        scheme_id: schemeId,
        citizen_id: citizenId,
        status: newStatus,
      });

      fetchEnrollments();
    } catch (err) {
      setError("Failed to update enrollment status.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Welfare Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Form className="mb-3 d-flex gap-3">
        <Form.Control
          type="text"
          placeholder="Scheme Name"
          onChange={(e) => setSearchScheme(e.target.value)}
        />
      </Form>

      {/* Welfare Schemes */}
      <h3>Available Welfare Schemes</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Scheme Name</th>
              <th>Description</th>
              <th>Application Deadline</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme, index) => (
              <tr key={scheme.Scheme_id}>
                <td>{index + 1}</td>
                <td>{scheme.Scheme_name}</td>
                <td>{scheme.Description}</td>
                <td>{scheme.Application_deadline}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Enrollments Table */}

      <Form className="mb-3 d-flex gap-3">
        <Form.Select onChange={(e) => setSearchStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Form.Select>
      </Form>

      <h3>Welfare Enrollments</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Scheme Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment, index) => (
              <tr key={enrollment.Citizen_fk}>
                <td>{index + 1}</td>
                <td>{enrollment.user_name}</td>
                <td>{enrollment.scheme_name}</td>
                <td>{enrollment.status}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() =>
                      handleUpdateStatus(
                        enrollment.Scheme_fk,
                        enrollment.Citizen_fk,
                        "APPROVED"
                      )
                    }
                  >
                    Approve
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      handleUpdateStatus(
                        enrollment.Scheme_fk,
                        enrollment.Citizen_fk,
                        "REJECTED"
                      )
                    }
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default EmployeeWelfScheme;

import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Button, Table, Form, Alert } from "react-bootstrap";
import api from "../../api/axiosConfig.tsx";

const AdminDashboard: React.FC = () => {
  const { userType } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [isVerifiedFilter, setIsVerifiedFilter] = useState("");
  const [sortBy, setSortBy] = useState("User_name");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userType !== "ADMIN") {
      setError("You are not authorized to access this panel.");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return;
    }
    fetchUsers();
    fetchActivityLog();
  }, [userTypeFilter, isVerifiedFilter]);

  const setCensusData = async () => {
    try {
      const response = await api.get("/admin/census");
    } catch (err) {
      setError("Failed to add census data.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const fetchUsers = async () => {
    try {
      const params: { User_type?: string; Is_verified?: string } = {};
      if (userTypeFilter) params.User_type = userTypeFilter;
      if (isVerifiedFilter) params.Is_verified = isVerifiedFilter;

      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const fetchActivityLog = async () => {
    try {
      // const response = await axios.get("/admin/activity-log");
      let response = { data: { data: mockActivityLog } }; // Mock response
      setActivityLog(response.data.data);
    } catch (err) {
      setError("Failed to fetch activity logs.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const handleDeleteUser = async (User_name: string) => {
    try {
      await api.delete(`/admin/delete/${User_name}`, { data: { user_name: User_name } });
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const handleVerifyUser = async (User_name: string, validation: boolean) => {
    try {
      await api.put(`/admin/verify/${User_name}`, { user_name: User_name, validation });
      fetchUsers();
    } catch (err) {
      setError("Failed to verify user.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      {/* <Form.Select
        className="mb-3"
        onChange={(e) => setUserTypeFilter(e.target.value)}
      >
        <option value="">All User Types</option>
        <option value="CITIZEN">Citizen</option>
        <option value="PANCHAYAT_EMPLOYEE">Panchayat Employee</option>
        <option value="GOVERNMENT_AGENCY">Government Agency</option>
      </Form.Select>
      <Form.Select
        className="mb-3"
        onChange={(e) => setIsVerifiedFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="true">Verified</option>
        <option value="false">Not Verified</option>
      </Form.Select> */}

      {/* Users Table */}
      <h3>Users</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => setSortBy("User_name")}>User Name</th>
            <th onClick={() => setSortBy("User_type")}>Type</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { users && users
            .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
            .map((user) => (
              <tr key={user.User_id}>
                <td>{user.User_name}</td>
                <td>{user.User_type}</td>
                <td>{user.Email}</td>
                <td>{user.Contact_number}</td>
                <td>{user.Is_verified ? "Yes" : "No"}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handleVerifyUser(user.User_name, true)}
                  >
                    Verify
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser(user.User_name)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* Activity Log */}
      {/* <h3>Activity Log</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Time</th>
            <th>From</th>
            <th>New Value</th>
            <th>Old Value</th>
            <th>Affected User</th>
            <th>Action By</th>
          </tr>
        </thead>
        <tbody>
          {activityLog.map((log) => (
            <tr key={log.Log_id}>
              <td>{log.Time}</td>
              <td>{log.From_value}</td>
              <td>{log.New_val}</td>
              <td>{log.Old_val}</td>
              <td>{log.Affected_user_name}</td>
              <td>{log.User_name}</td>
            </tr>
          ))}
        </tbody>
      </Table> */}
      {/* census form */}
        <Button variant="primary" onClick={setCensusData}>
          Save Current Year Census
        </Button>
    </div>
  );
};

export default AdminDashboard;

// Mock Data
const mockUsers = [
  {
    User_id: 1,
    User_name: "john_doe",
    User_type: "CITIZEN",
    Email: "john@example.com",
    Contact_number: "1234567890",
    Is_verified: true,
  },
  {
    User_id: 2,
    User_name: "jane_smith",
    User_type: "PANCHAYAT_EMPLOYEE",
    Email: "jane@example.com",
    Contact_number: "0987654321",
    Is_verified: false,
  },
];

const mockActivityLog = [
  {
    Log_id: 1,
    Time: "2025-03-01 10:00:00",
    From_value: "User Verification",
    New_val: "Verified",
    Old_val: "Not Verified",
    Affected_user_name: "john_doe",
    User_name: "admin",
  },
];

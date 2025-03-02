import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Button, Table, Form, Alert } from "react-bootstrap";

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
      return;
    }
    fetchUsers();
    fetchActivityLog();
  }, [userTypeFilter, isVerifiedFilter]);

  const fetchUsers = async () => {
    try {
      const params: { User_type?: string; Is_verified?: string } = {};
      if (userTypeFilter) params.User_type = userTypeFilter;
      if (isVerifiedFilter) params.Is_verified = isVerifiedFilter;

      // const response = await axios.get("/admin/user", { params });
      let response = { data: { data: mockUsers } }; // Mock response
      setUsers(response.data.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  const fetchActivityLog = async () => {
    try {
      // const response = await axios.get("/admin/activity-log");
      let response = { data: { data: mockActivityLog } }; // Mock response
      setActivityLog(response.data.data);
    } catch (err) {
      setError("Failed to fetch activity logs.");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      // await axios.delete("/admin/user", { data: { User_id: userId } });
      setUsers(users.filter((user) => user.User_id !== userId));
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const handleVerifyUser = async (userId: number, validation: boolean) => {
    try {
      // await axios.put(`/admin/verify/${userId}`, { User_id: userId, validation });
      setUsers(
        users.map((user) =>
          user.User_id === userId ? { ...user, Is_verified: validation } : user
        )
      );
    } catch (err) {
      setError("Failed to verify user.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Form.Select
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
      </Form.Select>

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
          {users
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
                    onClick={() => handleVerifyUser(user.User_id, true)}
                  >
                    Verify
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser(user.User_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* Activity Log */}
      <h3>Activity Log</h3>
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
      </Table>
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

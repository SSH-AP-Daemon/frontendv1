import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig.tsx";

const SignIn: React.FC = () => {
  const { setUserType, setRole } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    User_name: "",
    Password: "",
  });

  const [errors, setErrors] = useState({
    User_name: "",
    Password: "",
  });

  // const [errors, setErrors] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { User_name: "", Password: "" };

    if (!formData.User_name.trim()) {
      newErrors.User_name = "Username is required!";
      isValid = false;
    }

    if (!formData.Password.trim()) {
      newErrors.Password = "Password is required!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     console.log("User Data:", formData);
  //     // Perform login logic here
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setErrors(null);
    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.post("/user/login", formData);
      const User_type = response.data.user_type;
      setUserType(User_type); // Update global state

      const Role = response.data.Role || "";
      console.log("dgd");
      setRole(Role);
      console.log(User_type, Role);
      console.log(response);
      navigate("/"); // Redirect to home
    } catch (err: any) {
      setErrors(err.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg rounded-3" style={{ width: "350px" }}>
        <h2 className="text-center mb-3">Sign In</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="User_name">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              name="User_name"
              value={formData.User_name}
              onChange={handleChange}
              required
            />
            {errors.User_name && (
              <Alert variant="danger">{errors.User_name}</Alert>
            )}
          </Form.Group>

          <Form.Group controlId="Password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="Password"
              placeholder="Enter your password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
            />
            {errors.Password && (
              <Alert variant="danger">{errors.Password}</Alert>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mt-4">
            Sign In
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SignIn;

import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
// import { useAuth } from "./AuthContext";
import api from "../api/axiosConfig.tsx";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  // const { setUserType } = useAuth();
  const [formData, setFormData] = useState({
    User_name: "",
    Password: "",
    Name: "",
    Email: "",
    Contact_number: "",
    User_type: "",
    Date_of_birth: "",
    Date_of_death: "",
    Gender: "",
    Address: "",
    Educational_qualification: "",
    Occupation: "",
    Citizen_user_name: "",
    Role: "",
  });

  const [step, setStep] = useState(1); // Step control (1 = Basic Info, 2 = Extra Fields)
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Store error messages

  // Initialize the navigate function
  const navigate = useNavigate();

  const handleBack = () => {
    setStep(1);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateBasicInfo = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate contact number (must be 10 digits)
    if (!/^\d{10}$/.test(formData.Contact_number)) {
      newErrors.Contact_number = "Contact number must be exactly 10 digits.";
    }

    // Validate password (at least 8 chars, 1 special char, 1 digit, 1 uppercase)
    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.Password
      )
    ) {
      newErrors.Password =
        "Password must be at least 8 chars, with 1 uppercase, 1 digit, and 1 special char.";
    }

    setErrors(newErrors);
    
    setTimeout(() => {
      setErrors({});
    }, 2000);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateBasicInfo()) {
      setStep(2); // Move to next step only if validation passes
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      let data;
      if (formData.User_type === "PANCHAYAT_EMPLOYEE") {
        data = {
          User_name: formData.User_name,
          Password: formData.Password,
          Name: formData.Name,
          Email: formData.Email,
          Contact_number: formData.Contact_number,
          User_type: formData.User_type,
          Citizen_user_name: formData.Citizen_user_name,
          Role: formData.Role,
        };
      } else if (formData.User_type === "GOVERNMENT_AGENCY") {
        data = {
          User_name: formData.User_name,
          Password: formData.Password,
          Name: formData.Name,
          Email: formData.Email,
          Contact_number: formData.Contact_number,
          User_type: formData.User_type,
          Role: formData.Role,
        };
      } else if (formData.User_type === "CITIZEN") {
        data = {
          User_name: formData.User_name,
          Password: formData.Password,
          Name: formData.Name,
          Email: formData.Email,
          Contact_number: formData.Contact_number,
          User_type: formData.User_type,
          Date_of_birth: formData.Date_of_birth,
          Gender: formData.Gender,
          Address: formData.Address,
          Educational_qualification: formData.Educational_qualification,
          Occupation: formData.Occupation,
        };
      } else if (formData.User_type === "ADMIN") {
        data = {
          User_name: formData.User_name,
          Password: formData.Password,
          Name: formData.Name,
          Email: formData.Email,
          Contact_number: formData.Contact_number,
          User_type: formData.User_type,
          Date_of_birth: formData.Date_of_birth,
          Gender: formData.Gender,
          Address: formData.Address,
        };
      }
      const response = await api.post("user/register", data); // Axios call

      // setUserType(response.data.User_type); // Update global state
      console.log("User registered in as:", response.data.userType);

      // Navigate to the Home page after successful registration
      navigate("/");
    } catch (err: any) {
      setErrors(
        err.response?.data?.detail ||
          "SignUp failed. Please check your credentials."
      );
      setTimeout(() => {
        setErrors({});
      }, 2000);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg rounded-3" style={{ width: "350px" }}>
        <h2 className="text-center mb-3">Sign Up</h2>
        <Form onSubmit={step === 1 ? handleNext : handleFinalSubmit}>
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <>
              <Form.Group controlId="User_name">
                <Form.Label>UserName</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  name="User_name"
                  value={formData.User_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="Password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                />
                {errors.Password && (
                  <small className="text-danger">{errors.Password}</small>
                )}
              </Form.Group>

              <Form.Group controlId="Name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="Email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="Contact_number">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your contact number"
                  name="Contact_number"
                  value={formData.Contact_number}
                  onChange={handleChange}
                  required
                />
                {errors.Contact_number && (
                  <small className="text-danger">{errors.Contact_number}</small>
                )}
              </Form.Group>

              <Form.Group controlId="User_type" className="mt-3">
                <Form.Label>User Type</Form.Label>
                <Form.Select
                  name="User_type"
                  value={formData.User_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select User Type</option>
                  <option value="CITIZEN">Citizen</option>
                  <option value="ADMIN">Admin</option>
                  <option value="PANCHAYAT_EMPLOYEE">Panchayat Employee</option>
                  <option value="GOVERNMENT_AGENCY">Government Agency</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Next
              </Button>
            </>
          )}

          {/* STEP 2: Extra Fields Based on User Type */}
          {step === 2 && (
            <>
              {formData.User_type === "CITIZEN" && (
                <>
                  <Form.Group controlId="Date_of_birth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="Date_of_birth"
                      value={formData.Date_of_birth}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* <Form.Group controlId="Date_of_death">
                    <Form.Label>Date of Death</Form.Label>
                    <Form.Control
                      type="date"
                      name="Date_of_death"
                      value={formData.Date_of_death}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group> */}

                  <Form.Group controlId="Gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group controlId="Educational_qualification">
                    <Form.Label>Educational_qualification</Form.Label>
                    <Form.Select
                      name="Educational_qualification"
                      value={formData.Educational_qualification}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Educational qualification</option>
                      {/* Educational_qualification VARCHAR(20) CHECK (Educational_qualification IN ('Illiterate', 'Primary', 'Secondary', '10th', '12th', 'Graduate', 'Post-Graduate')) NOT NULL, */}
                      <option value="Illiterate">Illiterate</option>
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="10th">10th</option>
                      <option value="12th">12th</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post-Graduate">Post-Graduate</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group controlId="Occupation">
                    <Form.Label>Occupation</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="Occupation"
                      value={formData.Occupation}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="Address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="Address"
                      value={formData.Address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </>
              )}

              {formData.User_type === "ADMIN" && (
                <>
                  <Form.Group controlId="Date_of_birth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="Date_of_birth"
                      value={formData.Date_of_birth}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="Gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              {formData.User_type === "PANCHAYAT_EMPLOYEE" && (
                <>
                  <Form.Group controlId="Citizen_user_name">
                    <Form.Label>Citizen_user_name</Form.Label>
                    <Form.Control
                      type="name"
                      name="Citizen_user_name"
                      value={formData.Citizen_user_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="Role" className="mt-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="Role"
                      value={formData.Role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="ASSET">Asset Manager</option>
                      <option value="FAMILY">Family Manager</option>
                      <option value="ISSUES">Issue Manager</option>
                      <option value="DOCUMENT">Document Manager</option>
                      <option value="FINANCIAL_DATA">Finance Manager</option>
                      <option value="WELFARE_SCHEME">Welfare Manager</option>
                      <option value="INFRASTRUCTURE">
                        Infrastructure Manager
                      </option>
                      <option value="ENVIRONMENTAL_DATA">
                        Environment Manager
                      </option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              {formData.User_type === "GOVERNMENT_AGENCY" && (
                <Form.Group controlId="Role" className="mt-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="Role"
                    value={formData.Role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="WELFARE_SCHEME">Welfare Agency</option>
                    <option value="INFRASTRUCTURE">
                      Infrastructure Agency
                    </option>
                  </Form.Select>
                </Form.Group>
              )}

              <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="success" type="submit">
                  Submit
                </Button>
              </div>
            </>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default SignUp;

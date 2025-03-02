import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./AuthContext";

const NavBar: React.FC = () => {
  const { userType, setUserType, role } = useAuth();
  const navigate = useNavigate();

  // console log every 1 second using setInterval and clear it
  // const timer = setInterval(() => {
  //   console.log(userType, role);
  // }, 1000);

  // React.useEffect(() => {
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  const logout = () => {
    // call logout API //TODO
    setUserType("notLoggedIn");
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            {/* Not Logged In */}
            {userType === "notLoggedIn" && (
              <>
                <Nav.Link as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
                <Nav.Link as={Link} to="/signin">
                  Sign In
                </Nav.Link>
              </>
            )}

            {/* Citizen Navigation */}
            {userType === "CITIZEN" && (
              <>
                <Nav.Link as={Link} to="/citizen/assets">
                  Assets
                </Nav.Link>
                <Nav.Link as={Link} to="/citizen/family">
                  Family
                </Nav.Link>
                <Nav.Link as={Link} to="/citizen/documents">
                  Documents
                </Nav.Link>
                <Nav.Link as={Link} to="/citizen/finances">
                  Finances
                </Nav.Link>
                <Nav.Link as={Link} to="/citizen/welfare">
                  Welfare Schemes
                </Nav.Link>
                <Nav.Link as={Link} to="/citizen/issues">
                  Issues
                </Nav.Link>
                <Nav.Link as={Link} to="/citizen/infrastructure">
                  Infrastructure
                </Nav.Link>
                <Nav.Link as={Link} to="/citizen/profile">
                  Profile
                </Nav.Link>
              </>
            )}

            {/* Panchayat Employee Roles */}
            {userType === "PANCHAYAT_EMPLOYEE" &&
              ((role === "ASSET" && (
                <>
                  <Nav.Link as={Link} to="/employee/assets">
                    Assets
                  </Nav.Link>
                </>
              )) ||
                (role === "FAMILY" && (
                  <>
                    <Nav.Link as={Link} to="/employee/family">
                      Family
                    </Nav.Link>
                  </>
                )) ||
                (role === "ISSUES" && (
                  <>
                    <Nav.Link as={Link} to="/employee/issues">
                      Issues
                    </Nav.Link>
                  </>
                )) ||
                (role === "DOCUMENT" && (
                  <>
                    <Nav.Link as={Link} to="/employee/documents">
                      Documents
                    </Nav.Link>
                  </>
                )) ||
                (role === "FINANCIAL_DATA" && (
                  <>
                    <Nav.Link as={Link} to="/employee/financial-data">
                      Finances
                    </Nav.Link>
                  </>
                )) ||
                (role === "WELFARE_SCHEME" && (
                  <>
                    <Nav.Link as={Link} to="/employee/welfare-scheme">
                      Welfare Schemes
                    </Nav.Link>
                  </>
                )) ||
                (role === "INFRASTRUCTURE" && (
                  <>
                    <Nav.Link as={Link} to="/employee/infrastructure">
                      Infrastructure
                    </Nav.Link>
                  </>
                )) ||
                (role === "ENVIRONMENTAL_DATA" && (
                  <>
                    <Nav.Link as={Link} to="/employee/environmental-data">
                      Environmental Data
                    </Nav.Link>
                  </>
                ))) && (
                <>
                  <Nav.Link as={Link} to="/employee/]profile">
                    Profile
                  </Nav.Link>
                </>
              )}

            {/* Admin Navigation */}
            {userType === "ADMIN" && (
              <>
                <Nav.Link as={Link} to="/view">
                  View
                </Nav.Link>
                <Nav.Link as={Link} to="/activity_log">
                  Activity Log
                </Nav.Link>
              </>
            )}

            {/* Government Agency Navigation */}
            {userType === "GOVERNMENT_AGENCY" && (
              <>
                <Nav.Link as={Link} to="/view">
                  View
                </Nav.Link>
                <Nav.Link as={Link} to="/create">
                  Create
                </Nav.Link>
                <Nav.Link as={Link} to="/edit">
                  Edit
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Common: Profile & Logout */}
          {userType !== "notLoggedIn" && (
            <Nav>
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/" onClick={logout}>
                Logout
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

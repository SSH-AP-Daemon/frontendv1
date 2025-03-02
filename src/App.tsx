// import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Home from "./Home";
import CitizenAssets from "./Citizens/citizen_assets";
import CitizenFamily from "./Citizens/citizen_family";
import CitizenIssues from "./Citizens/citizen_issues";
import CitizenDocuments from "./Citizens/citizen_documents";
import CitizenFinances from "./Citizens/citizen_finances";
import CitizenWelfSchemes from "./Citizens/citizen_welfare";
import CitizenInfrastructure from "./Citizens/citizen_infra";
import CitizenProfile from "./Citizens/citizen_profile";
import EmployeeProfile from "./panchayat_employee/p_profile";
import EmployeeAssets from "./panchayat_employee/p_assets";
import EmployeeFamily from "./panchayat_employee/p_family";
import EmployeeIssues from "./panchayat_employee/p_issues";
import EmployeeDocuments from "./panchayat_employee/p_document";
import EmployeeFinance from "./panchayat_employee/p_finance";
import EmployeeWelfScheme from "./panchayat_employee/p_welfare";
import EmployeeInfrastructure from "./panchayat_employee/p_infra";
import EmployeeEnvironment from "./panchayat_employee/p_env";
import AdminDashboard from "./Admin/admin";
import GovernmentAgencyProfile from "./govt_agency/govt_profile";
import GovernmentAgencyWelfare from "./govt_agency/govt_welf";
import GovernmentInfrastructure from "./govt_agency/govt_infra";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/citizen/assets" element={<CitizenAssets />} />
        <Route path="/citizen/family" element={<CitizenFamily />} />
        <Route path="/citizen/issues" element={<CitizenIssues />} />
        <Route path="/citizen/documents" element={<CitizenDocuments />} />
        <Route path="/citizen/finances" element={<CitizenFinances />} />
        <Route path="/citizen/welfare" element={<CitizenWelfSchemes />} />
        <Route path="/citizen/profile" element={<CitizenProfile />} />
        <Route path="/employee/profile" element={<EmployeeProfile />} />
        <Route path="/employee/assets" element={<EmployeeAssets />} />
        <Route path="/employee/family" element={<EmployeeFamily />} />
        <Route path="/employee/issues" element={<EmployeeIssues />} />
        <Route path="/employee/documents" element={<EmployeeDocuments />} />
        <Route path="/employee/finances" element={<EmployeeFinance />} />
        <Route path="/employee/welfare-scheme" element={<EmployeeWelfScheme />} />
        <Route path="/employee/environment" element={<EmployeeEnvironment />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/govt/profile" element={<GovernmentAgencyProfile />} />
        <Route path="/govt_welf" element={<GovernmentAgencyWelfare />} />
        <Route path="/govt_infra" element={<GovernmentInfrastructure />} />

        <Route
          path="/employee/infrastructure"
          element={<EmployeeInfrastructure />}
        />
        <Route
          path="/citizen/infrastructure"
          element={<CitizenInfrastructure />}
        />
        <Route path="/" element={<Home />} />

        <Route
          path="*"
          element={
            <>
              <h1>404</h1>
              <h3>Bad gateway</h3>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;

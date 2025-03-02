import React, { createContext, useContext, useState } from "react";

// Define the type for authentication context
interface AuthContextType {
  jwt: string;
  userType: string;
  userId: number;
  userName: string;
  role: string;
  setJwt: (jwt: string) => void;
  setUserType: (userType: string) => void;
  setUserId: (userId: number) => void;
  setUserName: (userName: string) => void;
  setRole: (role: string) => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jwt, setJwt] = useState(() => {
    const storedJwt = localStorage.getItem("jwtToken");
    return storedJwt || "";
  });

  const [userType, setUserType] = useState(() => {
    const storedUserType = localStorage.getItem("userType");
    return storedUserType || "PANCHAYAT_EMPLOYEE";
  });

  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem("userId");
    return storedUserId ? parseInt(storedUserId, 10) : 0;
  });

  const [userName, setUserName] = useState(() => {
    const storedUserName = localStorage.getItem("userName");
    return storedUserName || "";
  });

  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole || "";
  });

  return (
    <AuthContext.Provider
      value={{
        jwt,
        userType,
        userId,
        userName,
        role,
        setJwt,
        setUserType,
        setUserId,
        setUserName,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
import React, { createContext, useContext, useState } from "react";

// Define the type for authentication context
interface AuthContextType {
  userType: string;
  userId: number;
  userName: string;
  role: string;
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
  const [userType, setUserType] = useState("PANCHAYAT_EMPLOYEE");
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("FIANNCIAL_DATA");

  return (
    <AuthContext.Provider
      value={{
        userType,
        userId,
        userName,
        role,
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

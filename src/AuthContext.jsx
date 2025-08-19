import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
const [role, setRole] = useState("PLAYER");

return (
    <AuthContext.Provider value={{ role, setRole }}>
    {children}
    </AuthContext.Provider>
);
}

export function useAuth() {
return useContext(AuthContext);
}

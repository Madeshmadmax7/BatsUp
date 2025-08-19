import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Store both role and userId (fanId/playerId)
    const [authState, setAuthState] = useState({
        id: null,    // fanId or playerId
        role: null,  // "FAN", "PLAYER", etc.
    });

    const setUser = ({ id, role }) => {
        setAuthState({ id, role });
    };

    return (
        <AuthContext.Provider value={{ authState, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

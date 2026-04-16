import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("auth:user");
            return raw
                ? JSON.parse(raw)
                : { id: null, role: null, fanId: null, playerId: null };
        } catch {
            return { id: null, role: null, fanId: null, playerId: null };
        }
    });

    useEffect(() => {
        localStorage.setItem("auth:user", JSON.stringify(user));
    }, [user]);

    const logout = () => {
        setUser({ id: null, role: null, fanId: null, playerId: null });
        localStorage.removeItem("auth:user");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { role } = useAuth();

    if(!role){
        return <Navigate to="/login" />;
    }

    if(role === "admin") return children;

    if(!allowedRoles.includes(role)){
        if (role === 'customer'){
            return <Navigate to="/client" />;
        } else {
            return <Navigate to="/admin" />;
        }
    }
    return children;
};

export default RoleProtectedRoute;

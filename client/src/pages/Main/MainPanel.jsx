import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ClientPage from "./pages/ClientPage";
import { AuthProvider } from "../../context/AuthContext";
import RoleProtectedRoute from "../../provider/RoleProtectedRoute";
import NotFound from "../NotFound/NotFound";

const MainPanel = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <MainLayout>
                            <Routes>
                                <Route path="/" element={<MainPage />} />
                                <Route
                                    path="/client"
                                    element={
                                        <AuthProvider>
                                            <ClientPage />
                                        </AuthProvider>
                                    }
                                />
                                <Route path="/*" element={<Navigate to={"/404"} />} />
                            </Routes>
                            
                        </MainLayout>
                    }
                />
                
            </Routes>
        </>
    );
};

export default MainPanel;

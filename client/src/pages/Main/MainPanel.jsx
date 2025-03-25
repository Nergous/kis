import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MainLayout from "./layout/MainLayout";
import ClientPage from "./pages/ClientPage";
import { AuthProvider } from "../../context/AuthContext";

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

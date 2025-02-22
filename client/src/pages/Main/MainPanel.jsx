import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/LoginPage";

const MainPanel = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <MainLayout>
                            <Routes>
                                <Route path="/*" element={<Navigate to="/" />} />
                                <Route path="/" element={<MainPage />} />
                                <Route path="/login" element={<LoginPage />} />
                            </Routes>
                        </MainLayout>
                    }
                />
            </Routes>
        </>
    );
};

export default MainPanel;

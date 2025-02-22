import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MainLayout from "./layout/MainLayout";

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
                            </Routes>
                        </MainLayout>
                    }
                />
            </Routes>
        </>
    );
};

export default MainPanel;

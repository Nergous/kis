import React from "react";
import Main from "../pages/Main/Main";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../pages/Main/layout/MainLayout";
import AdminPanel from "../pages/Admin/AdminPanel";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes> 
                <Route path="/" element={<MainLayout> <Main /> </MainLayout>} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;

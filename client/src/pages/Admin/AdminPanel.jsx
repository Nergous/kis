import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import MainAdminPage from "./pages/MainAdminPage";

const AdminPanel = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <AdminLayout>
                            <Routes>
                                <Route path="/" element={<MainAdminPage />} />
                            </Routes>
                        </AdminLayout>
                    }
                />
            </Routes>
        </>
    );
};

export default AdminPanel;

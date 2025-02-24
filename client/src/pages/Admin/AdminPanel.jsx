import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import MainAdminPage from "./pages/MainAdminPage";
import AdminStoragePage from "./pages/Storage/AdminStoragePage";
import AdminPackingPage from "./pages/AdminPackingPage";

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
                                <Route path="/storage" element={<AdminStoragePage />} />
                                <Route path="/packing" element={<AdminPackingPage />} />
                                <Route
                                    path="/*"
                                    element={<Navigate to="/admin" />}
                                />
                            </Routes>
                        </AdminLayout>
                    }
                />
            </Routes>
        </>
    );
};

export default AdminPanel;

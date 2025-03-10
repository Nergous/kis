import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import MainAdminPage from "./pages/MainAdminPage";
import AdminStoragePage from "./pages/Storage/AdminStoragePage";
import AdminPackingPage from "./pages/AdminPackingPage";
import EditProductPage from "./pages/Storage/EditProductPage/EditProductPage";
import CreateProductPage from "./pages/Storage/CreateProductPage/CreateProductPage";
import AdminEmployeesPage from "./pages/Employees/AdminEmployeesPage";
import AdminOrdersPage from "./pages/Orders/AdminOrdersPage";

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
                                <Route path="/storage/:id" element={<EditProductPage />} />
                                <Route path="/storage/create" element={<CreateProductPage />} />

                                <Route path="/packing" element={<AdminPackingPage />} />

                                <Route path="/employees" element={<AdminEmployeesPage />} />

                                <Route path="/orders" element={<AdminOrdersPage />} />


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

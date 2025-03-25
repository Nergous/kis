import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedProvider from "../../provider/ProtectedProvider";
import AdminLayout from "./layout/AdminLayout";
import MainAdminPage from "./pages/MainAdminPage/MainAdminPage";
import AdminStoragePage from "./pages/Storage/AdminStoragePage";
import AdminPackingPage from "./pages/Packing/AdminPackingPage";
import EditProductPage from "./pages/Storage/EditProductPage/EditProductPage";
import CreateProductPage from "./pages/Storage/CreateProductPage/CreateProductPage";
import AdminEmployeesPage from "./pages/Employees/AdminEmployeesPage";
import AdminOrdersPage from "./pages/Orders/AdminOrdersPage";
import RoleProtectedRoute from "../../provider/RoleProtectedRoute";
import DocsView from "./pages/DocsView";
import Customers from "./pages/Customers/Customers";

const AdminPanel = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <ProtectedProvider excludedRoles={["customer"]}>
                            <AdminLayout>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["manager", "storage", "director", "accountant"]}>
                                                <MainAdminPage />
                                            </RoleProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/storage"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["manager", "storage"]}>
                                                <AdminStoragePage />
                                            </RoleProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/storage/:id"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["manager", "storage"]}>
                                                <EditProductPage />
                                            </RoleProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/storage/create"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["storage"]}>
                                                <CreateProductPage />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/packing"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["storage"]}>
                                                <AdminPackingPage />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/employees"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["director"]}>
                                                <AdminEmployeesPage />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/orders"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["manager", "director", "accountant"]}>
                                                <AdminOrdersPage />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/docs"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["director", "accountant"]}>
                                                <DocsView />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/customers"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["manager", "director", "accountant"]}>
                                                <Customers />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    <Route path="/*" element={<Navigate to="/admin" />} />
                                </Routes>
                            </AdminLayout>
                        </ProtectedProvider>
                    }
                />
            </Routes>
        </>
    );
};

export default AdminPanel;

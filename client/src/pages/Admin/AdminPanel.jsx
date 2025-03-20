import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedProvider from "../../provider/ProtectedProvider";
import AdminLayout from "./layout/AdminLayout";
import MainAdminPage from "./pages/MainAdminPage";
import AdminStoragePage from "./pages/Storage/AdminStoragePage";
import AdminPackingPage from "./pages/Packing/AdminPackingPage";
import EditProductPage from "./pages/Storage/EditProductPage/EditProductPage";
import CreateProductPage from "./pages/Storage/CreateProductPage/CreateProductPage";
import AdminEmployeesPage from "./pages/Employees/AdminEmployeesPage";
import AdminOrdersPage from "./pages/Orders/AdminOrdersPage";
import RoleProtectedRoute from "../../provider/RoleProtectedRoute";

const AdminPanel = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <ProtectedProvider excludedRoles={['customer']}>
                            <AdminLayout>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["manager", "storage"]}>
                                                <MainAdminPage />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    {/*
                                    
                                        Вот тут пример того как должено выглядеть 
                                        разделение ролей

                                        У админа доступ ко всем страницам,
                                        тут для него ничего не надо прописывать

                                     */}
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
                                            <RoleProtectedRoute allowedRoles={["manager", "storage"]}>
                                                <CreateProductPage />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/packing"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["manager", "storage"]}>
                                                <AdminPackingPage />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/employees"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["manager", "storage"]}>
                                                <AdminEmployeesPage />
                                            </RoleProtectedRoute>
                                        }
                                    />

                                    <Route
                                        path="/orders"
                                        element={
                                            <RoleProtectedRoute allowedRoles={["manager", "storage"]}>
                                                <AdminOrdersPage />
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

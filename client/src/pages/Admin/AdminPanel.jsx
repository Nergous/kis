import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedProvider from "../../provider/ProtectedProvider";
import AdminLayout from "./layout/AdminLayout";
import MainAdminPage from "./pages/MainAdminPage";
import AdminStoragePage from "./pages/Storage/AdminStoragePage";
import AdminPackingPage from "./pages/AdminPackingPage";
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
                        <ProtectedProvider>
                            <AdminLayout>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<MainAdminPage />}
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
                                        element={<EditProductPage />}
                                    />
                                    <Route
                                        path="/storage/create"
                                        element={<CreateProductPage />}
                                    />

                                    <Route
                                        path="/packing"
                                        element={<AdminPackingPage />}
                                    />

                                    <Route
                                        path="/employees"
                                        element={<AdminEmployeesPage />}
                                    />

                                    <Route
                                        path="/orders"
                                        element={<AdminOrdersPage />}
                                    />

                                    <Route
                                        path="/*"
                                        element={<Navigate to="/admin" />}
                                    />
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

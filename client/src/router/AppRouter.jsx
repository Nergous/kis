import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "../pages/Admin/AdminPanel";
import MainPanel from "../pages/Main/MainPanel";
import LoginPage from "../pages/Main/pages/LoginPage";
import NotFound from "../pages/NotFound/NotFound";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes> 
                <Route path="/" element={<MainPanel/>} />
                <Route path="/admin/*" element={<AdminPanel />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;

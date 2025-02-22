import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPanel from "../pages/Admin/AdminPanel";
import MainPanel from "../pages/Main/MainPanel";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes> 
                <Route path="/*" element={<MainPanel/>} />
                <Route path="/admin/*" element={<AdminPanel />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;

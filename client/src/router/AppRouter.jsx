import React from "react";
import Main from "../pages/Main/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../pages/Main/layout/MainLayout";


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                
                <Route path="/" element={<MainLayout> <Main /> </MainLayout>} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;

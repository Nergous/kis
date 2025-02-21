import React from "react";
import Main from "../pages/Main/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;

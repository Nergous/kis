import React, { useEffect } from "react";
import api from "../../../../utils/api";
import "antd/dist/reset.css";
import DirectorStats from "./Stats/DirectorStats/DirectorStats";
// import AccountantStats from "./Stats/AccountantStats/AccountantStats";
// import ManagerStats from "./Stats/ManagerStats/ManagerStats";
// import StorageStats from "./Stats/StorageStats/StorageStats";

const MainAdminPage = () => {
    // director.GET("/order-by-status", controllers.GetOrdersCountByStatus)
    // director.GET("/workers-count", controllers.GetWorkersCount)
    // director.GET("/customers-count", controllers.GetCustomersCount)

    return (
        // Это чисто чтобы посмотреть, как теперь скролл происходит )))
        // Пусть останется, потом все равно добавлять чота сюда
        <div>
            <DirectorStats />
        </div>
    );
};

export default MainAdminPage;

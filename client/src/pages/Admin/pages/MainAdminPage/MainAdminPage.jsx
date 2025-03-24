import React from "react";
import api from "../../../../utils/api";
import { useAuth } from "../../../../context/AuthContext";
import "antd/dist/reset.css";
import DirectorStats from "./Stats/DirectorStats/DirectorStats";
import AccountantStats from "./Stats/AccountantStats/AccountantStats";
import ManagerStats from "./Stats/ManagerStats/ManagerStats";
import StorageStats from "./Stats/StorageStats/StorageStats";
import { Alert } from "antd";

const MainAdminPage = () => {
    const { role } = useAuth();

    // Функция для рендеринга соответствующего компонента статистики
    const renderStatsByRole = () => {
        switch (role) {
            case "director":
                return <DirectorStats />;
            case "accountant":
                return <AccountantStats />;
            case "manager":
                return <ManagerStats />;
            case "storage":
                return <StorageStats />;
            case "admin":
                // Админ видит всю статистику
                return (
                    <div>
                        <DirectorStats />
                        <AccountantStats />
                        <ManagerStats />
                        <StorageStats />
                    </div>
                );
            default:
                return <Alert message="Доступ запрещен" description="У вас недостаточно прав для просмотра этой страницы." type="error" showIcon />;
        }
    };

    return <div>{renderStatsByRole()}</div>;
    // return <AccountantStats />;
};

export default MainAdminPage;

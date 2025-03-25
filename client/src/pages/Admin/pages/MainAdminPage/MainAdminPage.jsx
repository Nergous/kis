import React, { useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import "antd/dist/reset.css";
import DirectorStats from "./Stats/DirectorStats/DirectorStats";
import AccountantStats from "./Stats/AccountantStats/AccountantStats";
import ManagerStorageStats from "./Stats/ManagerStorageStats/ManagerStorageStats";
import { Alert } from "antd";

const MainAdminPage = () => {
    const { role, name } = useAuth();

    useEffect(() => {
        document.title = "Главная страница";
    }, []);

    // Функция для рендеринга соответствующего компонента статистики
    const renderStatsByRole = () => {
        switch (role) {
            case "director":
                return <DirectorStats />;
            case "accountant":
                return <AccountantStats />;
            case "manager":
                return <ManagerStorageStats />;
            case "storage":
                return <ManagerStorageStats />;
            case "admin":
                // Админ видит всю статистику
                return (
                    <div>
                        <DirectorStats />
                        <AccountantStats />
                        <ManagerStorageStats />
                    </div>
                );
            default:
                return (
                    <Alert
                        message="Доступ запрещен"
                        description="У вас недостаточно прав для просмотра этой страницы."
                        type="error"
                        showIcon
                    />
                );
        }
    };

    return (
        <>
            <h1>Добро пожаловать, {name}</h1>
            <div>{renderStatsByRole()}</div>
        </>
    );
};

export default MainAdminPage;

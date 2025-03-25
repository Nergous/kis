import React, { useEffect, useMemo, useState } from "react";
import { Layout, Menu, Select, Space, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import { DropboxOutlined, HomeOutlined, AppstoreOutlined, UsergroupAddOutlined, ShoppingCartOutlined, FolderOpenOutlined } from "@ant-design/icons";

const { Sider } = Layout;
const { Option } = Select;

const AppSidebar = () => {
    const { role } = useAuth();
    const tempRole = useState(localStorage.getItem("role"));

    const handleRoleChange = (value) => {
        localStorage.setItem("role", value);
        window.location.reload();
    };

    const handleRoleReset = () => {
        localStorage.setItem("role", "admin");
        window.location.reload();
    };

    const filteredItems = useMemo(() => {
        const allItems = [
            {
                key: "0",
                icon: <HomeOutlined />,
                label: "Главная",
                to: "/admin",
                disabledFor: ["customer"],
                allowedFor: ["admin", "manager", "director", "accountant", "storage"],
            },
            {
                key: "1",
                icon: <AppstoreOutlined />,
                label: "Склад",
                to: "/admin/storage",
                disabledFor: ["customer", "director", "accountant"],
                allowedFor: ["admin", "manager", "storage"],
            },
            {
                key: "2",
                icon: <DropboxOutlined />,
                label: "Упаковка",
                to: "/admin/packing",
                disabledFor: ["customer", "manager", "director", "accountant"],
                allowedFor: ["admin", "storage"],
            },
            {
                key: "3",
                icon: <UsergroupAddOutlined />,
                label: "Работники",
                to: "/admin/employees",
                disabledFor: ["customer", "manager", "accountant", "storage"],
                allowedFor: ["admin", "director"],
            },
            {
                key: "4",
                icon: <ShoppingCartOutlined />,
                label: "Заказы",
                to: "/admin/orders",
                disabledFor: ["customer", "storage"],
                allowedFor: ["admin", "manager", "director", "accountant"],
            },
            {
                key: "5",
                label: "Договора",
                to: "/admin/docs",
                icon: <FolderOpenOutlined />,
                disabledFor: ["customer", "manager", "storage"],
                allowedFor: ["admin", "director", "accountant"],
            },
            {
                key: "6",
                label: "Клиенты",
                to: "/admin/customers",
                icon: <UsergroupAddOutlined />,
                disabledFor: ["customer", "storage"],
                allowedFor: ["admin", "manager", "director", "accountant"],
            }
        ];

        return allItems.filter((item) => {
            // Если указан явный список allowedFor, проверяем роль
            if (item.allowedFor) {
                return item.allowedFor.includes(role);
            }
            // Если указан список запрещённых ролей (disabledFor), исключаем их
            if (item.disabledFor) {
                return !item.disabledFor.includes(role);
            }
            // Иначе вкладка доступна всем
            return true;
        });
    }, [role]);


    // const role = localStorage.getItem("role");

    // if (role === "admin") {
    //     items.push({
    //         key: "3",
    //         icon: <AppstoreOutlined />,
    //         label: "Менеджер",
    //         to: "/admin/manager",
    //     });

    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState("0");

    // Функция для разделения пути
    const getBasePath = (path) => {
        const segments = path.split("/").filter(Boolean); // Убираем пустые строки
        return `/${segments.slice(0, 2).join("/")}`; // Берем первые два сегмента
    };

    // Обновляем selectedKey при изменении location.pathname
    useEffect(() => {
        const basePath = getBasePath(location.pathname);
        // console.log("Base path:", basePath); // Для отладки

        const currentItem = filteredItems.find((item) => item.to === basePath);
        setSelectedKey(currentItem?.key || "0");
    }, [location.pathname, filteredItems]);

    const menuItems = filteredItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => navigate(item.to),
    }));

    return (
        <Sider
            breakpoint="lg"
            // collapsedWidth="0"
            width={250}
            style={{
                background: "#fff",
                boxShadow: "3px 0 8px 0 rgba(0, 0, 0, 0.1)",
                position: "fixed",
                height: "100vh",
                overflow: "auto",
                zIndex: 10,
            }}>
            <Menu theme="light" mode="inline" selectedKeys={[selectedKey]} items={menuItems} />
            <Space style={{ display: "flex", flexDirection: "column", position: "absolute", bottom: "70px", left: "50px" }}>
                <Select value={tempRole} onChange={handleRoleChange} style={{ width: 150 }}>
                    <Option value="manager">Менеджер</Option>
                    <Option value="storage">Кладовщик</Option>
                    <Option value="director">Директор</Option>
                    <Option value="accountant">Бухгалтер</Option>
                </Select>
                <Button onClick={handleRoleReset}>Сбросить роль</Button>
            </Space>
        </Sider>
    );
};

export default AppSidebar;

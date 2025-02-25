import React, { useEffect, useMemo, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import {
    DropboxOutlined,
    HomeOutlined,
    AppstoreOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

const AppSidebar = () => {
    const items = useMemo(() => [
        {
            key: "0",
            icon: <HomeOutlined />,
            label: "Главная",
            to: "/admin",
        },
        {
            key: "1",
            icon: <AppstoreOutlined />,
            label: "Склад",
            to: "/admin/storage",
        },
        {
            key: "2",
            icon: <DropboxOutlined />,
            label: "Упаковка",
            to: "/admin/packing",
        },
    ], [] );

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

        const currentItem = items.find((item) => item.to === basePath);
        setSelectedKey(currentItem?.key || "0");
    }, [location.pathname, items]);

    const menuItems = items.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => navigate(item.to),
    }));

    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            width={250}
            style={{
                background: "#fff",
                boxShadow: "3px 0 8px 0 rgba(0, 0, 0, 0.1)",
                position: "fixed",
                height: "100vh",
                overflow: "auto",
                zIndex: 10,
            }}
        >
            <Menu
                theme="light"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
            />
        </Sider>
    );
};

export default AppSidebar;

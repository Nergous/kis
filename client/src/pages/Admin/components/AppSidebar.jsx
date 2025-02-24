import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import {
    DropboxOutlined,
    HomeOutlined,
    AppstoreOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

const AppSidebar = () => {
    const items = [
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
    ];

    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState("0");

    // Логируем текущий путь и выбранный ключ
    useEffect(() => {
        console.log("Current path:", location.pathname);
        const currentItem = items.find((item) =>
            location.pathname.startsWith(item.to)
        );
        console.log("Selected key:", currentItem?.key || "0");
        setSelectedKey(currentItem?.key || "0");
    }, [location.pathname]);

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
            }}
        >
            <div className="logo" />
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
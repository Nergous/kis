import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

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

    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            //   onBreakpoint={(broken) => {
            //     console.log(broken);
            //   }}
            //   onCollapse={(collapsed, type) => {
            //     console.log(collapsed, type);
            //   }}
            width={250}
            style={{
                background: "#fff",
                boxShadow: "3px 0 8px 0 rgba(0, 0, 0, 0.1)",
            }}
        >
            <div className="logo" />
            <Menu theme="light" mode="inline" defaultSelectedKeys={["0"]}>
                {items.map((item) => (
                    <Menu.Item key={item.key} icon={item.icon} onClick={() => navigate(item.to)}>
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>
    );
};

export default AppSidebar;

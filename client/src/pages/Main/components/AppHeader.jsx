import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Input } from "antd";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import "antd/dist/reset.css";
import logo from "../../../logo.png";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();

    return (
        <Header
            style={{
                background: "#4caf50",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 20px",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}
        >
            <img
                src={logo}
                alt="logo"
                style={{ height: 40 }}
                onClick={() => navigate("/")}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.transition = "transform 0.3s ease-in-out";
                    e.currentTarget.style.cursor = "pointer";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.transition = "transform 0.3s ease-in-out";
                }}
            />
            <Input
                placeholder="Поиск..."
                prefix={<SearchIcon />}
                style={{ width: "80%", borderRadius: 20, padding: "5px 10px" }}
            />
            <div>
                <IconButton
                    style={{ color: "white" }}
                    onClick={() => navigate("/client")}
                >
                    <AccountCircleIcon />
                </IconButton>
                <IconButton style={{ color: "white" }}>
                    <ShoppingCartIcon />
                </IconButton>
            </div>
        </Header>
    );
};

export default AppHeader;

import React from "react";
import { Layout, Input } from "antd";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import "antd/dist/reset.css";
import logo from "../../../logo.png";

const { Header } = Layout;

const AppHeader = () => {
    return (
        <Header
            style={{
                background: "#4caf50",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 20px",
            }}
        >
            <img src={logo} alt="logo" style={{ height: 40 }} />
            <Input
                placeholder="Поиск..."
                prefix={<SearchIcon />}
                style={{ width: "80%", borderRadius: 20, padding: "5px 10px" }}
            />
            <div>
                <IconButton style={{ color: "white" }}>
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

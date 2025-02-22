import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "antd/dist/reset.css";
import logo_2 from "../../../logo_2.png";

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
            }}
        >
            <img
                src={logo_2}
                alt="logo_2"
                style={{ height: 40, margin: "0 auto" }}
                onClick={() => navigate("/")}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.transition =
                        "transform 0.3s ease-in-out";
                    e.currentTarget.style.cursor = "pointer";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.transition =
                        "transform 0.3s ease-in-out";
                }}
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

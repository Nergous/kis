import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Layout } from "antd";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "antd/dist/reset.css";
import logo_2 from "../../../logo_2.png";
import { useAuth } from "../../../context/AuthContext";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
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
            }}>
            <img
                src={logo_2}
                alt="logo_2"
                style={{ height: 40, margin: "0 auto" }}
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
            <div>
                <IconButton style={{ color: "white" }}>
                    <AccountCircleIcon />
                </IconButton>
            </div>
            <Button onClick={logout}>
                Выйти из аккаунта
            </Button>
        </Header>
    );
};

export default AppHeader;

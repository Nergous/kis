import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Input, Badge } from "antd";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import "antd/dist/reset.css";
import logo from "../../../logo.png";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const [cartTotalItems, setCartTotalItems] = useState(0);

    // Функция для получения общего количества товаров в корзине
    const getCartTotalItems = () => {
        console.log("getCartTotalItems");
        const cart = JSON.parse(localStorage.getItem("cart")) || {};
        const total = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
        setCartTotalItems(total);
    };

    // Эффект для отслеживания изменений в localStorage
    useEffect(() => {
        // Вызываем функцию при монтировании компонента
        getCartTotalItems();

        // Функция для проверки изменений в localStorage
        const checkForUpdates = () => {
            getCartTotalItems();
        };

        // Подписываемся на кастомное событие (если вы его создаете)
        window.addEventListener("cartUpdated", checkForUpdates);

        // Отписываемся от события при размонтировании компонента
        return () => {
            window.removeEventListener("cartUpdated", checkForUpdates);
        };
    }, []);

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
                <IconButton style={{ color: "white !important" }} onClick={() => window.dispatchEvent(new Event("openCart"))} >
                    <Badge
                        count={cartTotalItems}
                        style={{ 
                            backgroundColor: "#ff4444", 
                            fontFamily: "'DMSans-Medium', sans-serif" 
                        }}
                    >
                        <ShoppingCartIcon style={{ color: "white" }}/>
                    </Badge>
                </IconButton>
            </div>
        </Header>
    );
};

export default AppHeader;
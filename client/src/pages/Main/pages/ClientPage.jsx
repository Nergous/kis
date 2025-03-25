import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { Assignment, Archive } from "@mui/icons-material";
import "antd/dist/reset.css";
import "../../../fonts.css";
import api from "../../../utils/api";
import { showErrorNotification } from "../../../ui/Notification/Notification";

// Import the separated components
import UserProfileCard from "../components/UserProfileCard/UserProfileCard";
import OrderCard from "../components/OrderCard/OrderCard";

const ClientPage = () => {
    const [userData, setUserData] = useState(null);
    const [ordersData, setOrdersData] = useState({
        current: [],
        archived: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Личный кабинет";
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch the data using our API utility
                const [userResponse, ordersResponse] = await Promise.all([
                    api().get("/api/customer-lk"),
                    api().get("/api/customer-lk/orders")
                ]);
                
                // Set the user data directly from the response
                setUserData(userResponse.data);
                
                // Process the orders data
                const orders = ordersResponse.data;
                if (Array.isArray(orders)) {
                    setOrdersData({
                        current: orders.filter((o) => o.status !== "received"),
                        archived: orders.filter((o) => o.status === "received"),
                    });
                } else {
                    setOrdersData({
                        current: [],
                        archived: []
                    });
                    console.warn("Orders data is not an array:", orders);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Произошла ошибка при загрузке данных");
                showErrorNotification(err.message || "Произошла ошибка при загрузке данных");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ 
                padding: 40, 
                textAlign: "center",
                background: "white",
                borderRadius: 16,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                margin: "40px auto",
                maxWidth: 400
            }}>
                <div style={{ marginBottom: 20, color: "#085615" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#085615"/>
                        <path d="M12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" fill="#085615"/>
                    </svg>
                </div>
                <div style={{ 
                    fontFamily: "'DMSans-Medium', sans-serif", 
                    color: "#333",
                    fontSize: 18,
                    marginBottom: 8
                }}>
                    Загрузка данных
                </div>
                <div style={{ 
                    fontFamily: "'DMSans-Regular', sans-serif", 
                    color: "#666",
                }}>
                    Пожалуйста, подождите...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                padding: 40, 
                textAlign: "center",
                background: "white",
                borderRadius: 16,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                margin: "40px auto",
                maxWidth: 500,
                color: "#c62828"
            }}>
                <div style={{ marginBottom: 20 }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#c62828"/>
                    </svg>
                </div>
                <div style={{ 
                    fontFamily: "'DMSans-Medium', sans-serif", 
                    fontSize: 18,
                    marginBottom: 8
                }}>
                    Ошибка при загрузке данных
                </div>
                <div style={{ 
                    fontFamily: "'DMSans-Regular', sans-serif", 
                    color: "#666",
                }}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px 40px" }}>
            <UserProfileCard userData={userData} />

            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        key: "1", 
                        label: (
                            <span style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>
                                <Assignment style={{ marginRight: 8 }} />
                                Текущие заказы ({ordersData.current.length})
                            </span>
                        ),
                        children: ordersData.current.length > 0 ? 
                            ordersData.current.map((order) => <OrderCard key={order.ID} order={order} />) :
                            <div style={{ 
                                padding: 30, 
                                textAlign: "center", 
                                background: "#f9f9f9", 
                                borderRadius: 16,
                                color: "#666",
                                fontFamily: "'DMSans-Regular', sans-serif",
                            }}>
                                У вас пока нет текущих заказов
                            </div>,
                    },
                    {
                        key: "2",
                        label: (
                            <span style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>
                                <Archive style={{ marginRight: 8 }} />
                                Архив ({ordersData.archived.length})
                            </span>
                        ),
                        children: ordersData.archived.length > 0 ?
                            ordersData.archived.map((order) => <OrderCard key={order.ID} order={order} />) :
                            <div style={{ 
                                padding: 30, 
                                textAlign: "center", 
                                background: "#f9f9f9", 
                                borderRadius: 16,
                                color: "#666",
                                fontFamily: "'DMSans-Regular', sans-serif",
                            }}>
                                У вас пока нет завершенных заказов
                            </div>,
                    },
                ]}
            />
        </div>
    );
};

export default ClientPage;
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { Phone, Email, Assignment, Archive } from "@mui/icons-material";
import "antd/dist/reset.css";
import "../../../fonts.css";
import api from "../../../utils/api";

import { showErrorNotification } from "../../../ui/Notification/Notification";

//----------- /api/customer-lk
//----------- /api/customer-lk/orders

const UserProfileCard = ({ userData }) => (
    <div
        style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: 30,
        }}>
        <h1
            style={{
                fontFamily: "'DMSans-Medium', sans-serif",
                color: "#085615",
                marginBottom: 25,
            }}>
            Личный кабинет
        </h1>

        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
            <div
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#e8f5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    color: "#085615",
                }}>
                {userData?.name[0]}
            </div>

            <div>
                <h2
                    style={{
                        fontFamily: "'DMSans-Medium', sans-serif",
                        color: "#085615",
                        margin: 0,
                    }}>
                    {userData?.name}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                    <Phone fontSize="small" style={{ color: "#666" }} />
                    <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>{userData?.phone}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <Email fontSize="small" style={{ color: "#666" }} />
                    <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>{userData?.email}</span>
                </div>
            </div>
        </div>
    </div>
);

const OrderCard = ({ order }) => (
    <div
        style={{
            background: "white",
            borderRadius: "12px",
            padding: "15px",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: 15,
        }}>
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
            }}>
            <div>
                <span
                    style={{
                        fontFamily: "'DMSans-Medium', sans-serif",
                        color: "#085615",
                        marginRight: 15,
                    }}>
                    Заказ №{order.id}
                </span>
                <span
                    style={{
                        background: "#e8f5e9",
                        borderRadius: 15,
                        padding: "4px 12px",
                        fontSize: 12,
                        color: "#085615",
                    }}>
                    {order.status}
                </span>
            </div>
            <span
                style={{
                    fontFamily: "'DMSans-Medium', sans-serif",
                    color: "#085615",
                }}>
                {order.total}
            </span>
        </div>

        <div
            style={{
                borderTop: "1px solid #eee",
                paddingTop: 12,
                marginBottom: 12,
            }}>
            {order.products.map((product, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        fontFamily: "'DMSans-Regular', sans-serif",
                    }}>
                    <span>{product.name}</span>
                    <span>
                        {product.quantity} × {product.price}
                    </span>
                </div>
            ))}
        </div>

        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#666",
                fontSize: 12,
            }}>
            <span>Дата заказа: {order.date}</span>
            <span>Способ получения: Самовывоз</span>
        </div>
    </div>
);

const ClientPage = () => {
    const [userData, setUserData] = useState(null);
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([api().get("/api/customer-lk"), api().get("/api/customer-lk/orders")])
                    .then((responses) => {
                        setUserData(responses[0]);
                        setOrdersData(responses[1]);
                    })
                    .catch((error) => {
                        showErrorNotification(error.responses.data.error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });

                const [user, orders] = await Promise.all([userData, ordersData]);

                setUserData(user);
                setOrdersData({
                    current: orders.filter((o) => o.status !== "received"),
                    archived: orders.filter((o) => o.status === "received"),
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div style={{ padding: 20, textAlign: "center" }}>Загрузка данных...</div>;
    }

    if (error) {
        return <div style={{ padding: 20, color: "red", textAlign: "center" }}>Ошибка: {error}</div>;
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
                        children: ordersData.current.map((order) => <OrderCard key={order.id} order={order} />),
                    },
                    {
                        key: "2",
                        label: (
                            <span style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>
                                <Archive style={{ marginRight: 8 }} />
                                Архив ({ordersData.archived.length})
                            </span>
                        ),
                        children: ordersData.archived.map((order) => <OrderCard key={order.id} order={order} />),
                    },
                ]}
            />
        </div>
    );
};

export default ClientPage;

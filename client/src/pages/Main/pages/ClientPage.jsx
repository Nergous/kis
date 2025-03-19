import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { Phone, Email, Assignment, Archive } from "@mui/icons-material";
import "antd/dist/reset.css";
import "../../../fonts.css";
import api from "../../../utils/api";

import { showErrorNotification } from "../../../ui/Notification/Notification";

//----------- /api/customer-lk
//----------- /api/customer-lk/orders

const UserProfileCard = ({ userData }) => {
    // Check if userData exists before proceeding
    if (!userData) return null;
    
    // Determine if the customer is a physical person or a business entity
    const isPhysicalPerson = userData.customer_type === "phys";
    
    // For physical person, construct the full name from individual parts
    const fullName = isPhysicalPerson 
        ? `${userData.surname || ""} ${userData.first_name || ""} ${userData.patronymic || ""}`.trim()
        : userData.main_booker || ""; // For business, use main_booker as the primary name
    
    // Get the first letter for the avatar
    const firstLetter = isPhysicalPerson 
        ? (userData.surname && userData.surname[0]) || "П" 
        : (userData.main_booker && userData.main_booker[0]) || "К";
    
    // Get display text for the customer type
    const customerTypeText = isPhysicalPerson ? "Физическое лицо" : "Юридическое лицо";
    
    return (
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                <span>Личный кабинет</span>
                <div 
                    style={{ 
                        display: "inline-block", 
                        background: "#e8f5e9", 
                        borderRadius: 15, 
                        padding: "4px 12px", 
                        fontSize: 14, 
                        color: "#085615",
                    }}>
                    {customerTypeText}
                </div>
            </h1>

            <div style={{ display: "flex", gap: 25 }}>
                {/* Left column with avatar */}
                <div>
                    <div
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            background: "#e8f5e9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 32,
                            color: "#085615",
                            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
                        }}>
                        {firstLetter}
                    </div>
                </div>

                {/* Main content area */}
                <div style={{ flex: 1 }}>
                    {/* Physical person information */}
                    {isPhysicalPerson && (
                        <div>
                            <h2
                                style={{
                                    fontFamily: "'DMSans-Medium', sans-serif",
                                    color: "#085615",
                                    margin: 0,
                                    marginBottom: 16,
                                    fontSize: 22
                                }}>
                                {fullName}
                            </h2>
                            
                            <div style={{ 
                                display: "flex", 
                                flexWrap: "wrap",
                                gap: "16px"
                            }}>
                                {userData.email && (
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 10,
                                        background: "#f9f9f9",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        minWidth: "200px"
                                    }}>
                                        <Email fontSize="small" style={{ color: "#085615" }} />
                                        <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>{userData.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Business information */}
                    {!isPhysicalPerson && (
                        <div>
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between",
                                marginBottom: 16
                            }}>
                                <h2
                                    style={{
                                        fontFamily: "'DMSans-Medium', sans-serif",
                                        color: "#085615",
                                        margin: 0,
                                        fontSize: 22
                                    }}>
                                    {fullName}
                                </h2>
                                
                                {userData.inn && (
                                    <div style={{ 
                                        background: "#f9f9f9",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        fontFamily: "'DMSans-Medium', sans-serif",
                                    }}>
                                        <span style={{ color: "#666" }}>ИНН: </span>
                                        <span>{userData.inn}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "16px",
                                marginBottom: 20
                            }}>
                                {userData.email && (
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 10,
                                        background: "#f9f9f9",
                                        padding: "8px 16px",
                                        borderRadius: "8px"
                                    }}>
                                        <Email fontSize="small" style={{ color: "#085615" }} />
                                        <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>{userData.email}</span>
                                    </div>
                                )}
                                
                                {userData.director && (
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 10,
                                        background: "#f9f9f9",
                                        padding: "8px 16px",
                                        borderRadius: "8px"
                                    }}>
                                        <span style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666" }}>Директор:</span>
                                        <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>{userData.director}</span>
                                    </div>
                                )}
                            </div>
                            
                            {userData.payment_char && (
                                <div style={{ 
                                    marginTop: 16, 
                                    borderTop: "1px solid #eee", 
                                    paddingTop: 16 
                                }}>
                                    <div style={{ 
                                        fontFamily: "'DMSans-Medium', sans-serif", 
                                        marginBottom: 12,
                                        color: "#085615",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="6" width="18" height="12" rx="2" stroke="#085615" strokeWidth="2"/>
                                            <path d="M3 10H21" stroke="#085615" strokeWidth="2"/>
                                            <path d="M7 15H13" stroke="#085615" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        Платежная информация
                                    </div>
                                    
                                    <div style={{ 
                                        display: "grid", 
                                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                        gap: "12px" 
                                    }}>
                                        <div style={{ 
                                            padding: "8px 12px",
                                            background: "#f9f9f9",
                                            borderRadius: "8px"
                                        }}>
                                            <div style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666", fontSize: "12px" }}>Банк:</div>
                                            <div style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>{userData.payment_char.bank}</div>
                                        </div>
                                        
                                        <div style={{ 
                                            padding: "8px 12px",
                                            background: "#f9f9f9",
                                            borderRadius: "8px"
                                        }}>
                                            <div style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666", fontSize: "12px" }}>БИК:</div>
                                            <div style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>{userData.payment_char.bik}</div>
                                        </div>
                                        
                                        <div style={{ 
                                            padding: "8px 12px",
                                            background: "#f9f9f9",
                                            borderRadius: "8px",
                                            gridColumn: "1 / -1"
                                        }}>
                                            <div style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666", fontSize: "12px" }}>Расчетный счет:</div>
                                            <div style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>{userData.payment_char.payment_number}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

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
    const [ordersData, setOrdersData] = useState({
        current: [],
        archived: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setOrdersData({
                    current: orders.filter((o) => o.status !== "received"),
                    archived: orders.filter((o) => o.status === "received"),
                });
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
                        children: ordersData.current.length > 0 ? 
                            ordersData.current.map((order) => <OrderCard key={order.id} order={order} />) :
                            <div style={{ padding: 20, textAlign: "center" }}>Нет текущих заказов</div>,
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
                            ordersData.archived.map((order) => <OrderCard key={order.id} order={order} />) :
                            <div style={{ padding: 20, textAlign: "center" }}>Архив заказов пуст</div>,
                    },
                ]}
            />
        </div>
    );
};

export default ClientPage;

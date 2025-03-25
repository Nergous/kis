import React, { useState } from "react";
import SubOrderModal from "../SubOrderModal/SubOrderModal";
import PaymentModal from "../PaymentModal/PaymentModal";
import { formatPrice, formatDeliveryDate, formatOrderId } from "./utils";


const OrderCard = ({ order, onUpdateOrderStatus }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(order);

    // Маппинг статусов
    const statusMap = {
        in_processing: "В обработке",
        awaiting_payment: "Ожидает оплаты",
        in_assembly: "В сборке",
        awaiting_shipment: "Ожидает отправки",
        in_transit: "В пути",
        received: "Получен",
        contacting: "Связь с клиентом",
    };

    // Маппинг способов оплаты
    const paymentTermsMap = {
        prepayment: "Предоплата",
        postpayment: "Постоплата",
        full_payment: "Полная оплата",
    };

    // Получение количества товаров в заказе
    const getItemCount = () => {
        if (!Array.isArray(currentOrder.order_content)) return 0;
        return currentOrder.order_content.reduce((sum, item) => sum + (item.quantity || 0), 0);
    };

    // Обработчик успешной оплаты
    const handlePaymentSuccess = () => {
        const updatedOrder = {
            ...currentOrder,
            is_paid: true,
            payment_time: new Date().toISOString()
        };
        
        setCurrentOrder(updatedOrder);
        
        if (onUpdateOrderStatus) {
            onUpdateOrderStatus(updatedOrder);
        }
    };

    return (
        <>
            <div
                style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                    marginBottom: 20,
                    border: "1px solid #f0f0f0",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                }}
                onClick={() => setIsModalOpen(true)}
                onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.12)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = "0px 2px 8px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span
                            style={{
                                fontFamily: "'DMSans-Medium', sans-serif",
                                color: "#085615",
                                fontSize: 18,
                            }}>
                            Заказ №{formatOrderId(currentOrder.order_id_unique)}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                                style={{
                                    background: currentOrder.status === "canceled" ? "#ffebee" : 
                                               currentOrder.status === "awaiting_payment" ? "#fff3e0" : 
                                               "#e8f5e9",
                                    borderRadius: 15,
                                    padding: "4px 12px",
                                    fontSize: 13,
                                    color: currentOrder.status === "canceled" ? "#c62828" : 
                                           currentOrder.status === "awaiting_payment" ? "#fb8c00" : 
                                           "#085615",
                                    fontFamily: "'DMSans-Medium', sans-serif",
                                }}>
                                {statusMap[currentOrder.status] || currentOrder.status}
                            </span>
                            {currentOrder.is_paid && (
                                <span
                                    style={{
                                        background: "#e8f5e9",
                                        borderRadius: 15,
                                        padding: "4px 12px",
                                        fontSize: 13,
                                        color: "#085615",
                                        fontFamily: "'DMSans-Medium', sans-serif",
                                    }}>
                                    Оплачено
                                </span>
                            )}
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                            style={{
                                fontFamily: "'DMSans-Medium', sans-serif",
                                color: "#085615",
                                fontSize: 18,
                            }}>
                            {formatPrice(currentOrder.total_price)}
                        </span>
                        {currentOrder.status === "awaiting_payment" && !currentOrder.is_paid && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPaymentModalOpen(true);
                                }}
                                style={{
                                    backgroundColor: "#085615",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "8px 16px",
                                    fontFamily: "'DMSans-Medium', sans-serif",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s ease",
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#0a7a1b";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "#085615";
                                }}>
                                Оплатить
                            </button>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 16,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "16px",
                        marginBottom: "10px",
                    }}>
                    <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                        <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Адрес доставки:</div>
                        <div>{currentOrder.address || "Не указан"}</div>
                    </div>

                    <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                        <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Дата доставки:</div>
                        <div>{formatDeliveryDate(currentOrder.delivery_date)}</div>
                    </div>

                    <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                        <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Способ оплаты:</div>
                        <div>{paymentTermsMap[currentOrder.payment_terms] || currentOrder.payment_terms}</div>
                    </div>

                    {currentOrder.payment_time && (
                        <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                            <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Время оплаты:</div>
                            <div>{formatDeliveryDate(currentOrder.payment_time)}</div>
                        </div>
                    )}
                </div>

                {statusMap[currentOrder.status] === "Связь с клиентом" && (
                    <div
                        style={{
                            borderTop: "1px solid #f0f0f0",
                            paddingTop: 16,
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}>
                        <div>
                        {currentOrder.comment && (
                            <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                                <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Сообщение клиенту:</div>
                                <div style={{ fontWeight: "bold" }}>{currentOrder.comment}</div>
                            </div>
                        )}
                        </div>
                    </div>
                )}

                <div
                    style={{
                        marginTop: 16,
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                        <span style={{ color: "#666" }}>Товаров в заказе: {getItemCount()}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            color: "#085615",
                            fontFamily: "'DMSans-Medium', sans-serif",
                            fontSize: 14,
                        }}>
                        Просмотреть содержимое
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginLeft: "4px", transition: "transform 0.2s ease" }}
                            className="arrow-icon">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
            </div>

            <SubOrderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                orderContent={currentOrder.order_content} 
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </>
    );
};

export default OrderCard;
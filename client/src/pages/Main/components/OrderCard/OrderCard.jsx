import React, { useState, useEffect } from "react";
import SubOrderModal from "../SubOrderModal/SubOrderModal";
import PaymentModal from "../PaymentModal/PaymentModal";
import api from "../../../../utils/api";
import { formatPrice, formatDeliveryDate } from "./utils";
import { CONTRACTS } from "../../../../constants/contracts";

// Импортируем иконки (можно использовать react-icons или свои SVG)
import { FaFileAlt, FaFilePdf, FaDownload } from "react-icons/fa";

const OrderCard = ({ order, onUpdateOrderStatus }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(order);
    const [isPaid, setIsPaid] = useState("not_paid");
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            try {
                setDocuments(order.contracts);
            } catch (error) {}
        };

        fetchData();
    }, []);

    const statusMap = {
        in_processing: "В обработке",
        awaiting_payment: "Ожидает оплаты",
        in_assembly: "В сборке",
        awaiting_shipment: "Ожидает отправки",
        in_transit: "В пути",
        received: "Получен",
        contacting: "Связь с клиентом",
    };

    const paymentTermsMap = {
        prepayment: "Предоплата",
        postpayment: "Постоплата",
        full_payment: "Полная оплата",
    };

    const getItemCount = () => {
        if (!Array.isArray(currentOrder.order_content)) return 0;
        return currentOrder.order_content.reduce((sum, item) => sum + (item.quantity || 0), 0);
    };

    const handlePaymentSuccess = async () => {
        try {
            const paymentDate = new Date();
            var payment_sum = currentOrder.total_price;
            var status_order = "in_assembly";
            if ((currentOrder.debt_status === "debt" || currentOrder.debt_status === "not_paid") && currentOrder.status === "received") {
                status_order = "received";
            }

            if (currentOrder.payment_terms === "postpayment" && (currentOrder.status === "received" || currentOrder.status === "in_transit")) {
                status_order = currentOrder.status;
            }

            if (currentOrder.payment_terms === "prepayment" && currentOrder.status === "awaiting_payment") {
                payment_sum = (currentOrder.total_price / 100) * 30;
            }

            if (currentOrder.payment_terms === "prepayment" && currentOrder.status != "awaiting_payment" && currentOrder.status != "in_processing") {
                status_order = currentOrder.status;
                payment_sum = (currentOrder.total_price / 100) * 70;
            }

            console.log("МЕНЯЕМ НА " + payment_sum + " СТАТУС " + status_order);
            const [paymentResponse, statusResponse] = await Promise.all([
                api().post("/api/payment", {
                    payment_date: paymentDate.toISOString(),
                    payment_sum: payment_sum,
                    order_id: currentOrder.ID,
                }),
                api().patch(`/api/orders/${currentOrder.ID}/status`, {
                    status: status_order,
                }),
            ]);

            if (!paymentResponse.ok || !statusResponse.ok) {
                throw new Error(paymentResponse.ok ? "Не удалось обновить статус заказа" : "Не удалось создать платеж");
            }

            const updatedOrder = {
                ...currentOrder,
                is_paid: true,
                payment_time: paymentDate.toISOString(),
                status: "in_assembly",
            };

            setCurrentOrder(updatedOrder);
            setIsPaid(true);

            if (onUpdateOrderStatus) {
                onUpdateOrderStatus(updatedOrder);
            }
        } catch (error) {
            console.error("Ошибка при обработке платежа:", error);
        }
    };
    const handleOrderReceived = async () => {
        try {
            const receivedDate = new Date();

            const statusResponse = await api().patch(`/api/orders/${currentOrder.ID}/status`, {
                status: "received",
            });

            if (!statusResponse.ok) {
                throw new Error("Не удалось обновить статус заказа");
            }

            const updatedOrder = {
                ...currentOrder,
                status: "received",
                received_time: receivedDate.toISOString(),
            };

            setCurrentOrder(updatedOrder);

            if (onUpdateOrderStatus) {
                onUpdateOrderStatus(updatedOrder);
            }
        } catch (error) {
            console.error("Ошибка при обновлении статуса заказа:", error);
        }
    };

    const handleDownload = (filePath, documentType) => {
        const link = document.createElement("a");
        link.href = filePath;
        link.download = `${documentType}_заказ_${currentOrder.order_id_unique}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getDocumentTitle = (type) => {
        switch (type) {
            case "invoice":
                return "Накладная";
            case "order":
                return "Договор";
            case "receipt":
                return "Чек";
            case "acceptance":
                return "Акт получения";
            default:
                return "Документ";
        }
    };

    const paymentStatus = (type) => {
        switch (type) {
            case "paid":
                return "Оплачен";
            case "not_paid":
                return "Не оплачен";
            case "partial":
                return "Частично оплачен";
            case "debt":
                return "Задолженность";
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
                    marginBottom: "20px",
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
                        marginBottom: "16px",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span
                            style={{
                                fontFamily: "'DMSans-Medium', sans-serif",
                                color: "#085615",
                                fontSize: "18px",
                            }}>
                            Заказ № {currentOrder.order_id_unique}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                                style={{
                                    background:
                                        currentOrder.status === "canceled"
                                            ? "#ffebee"
                                            : currentOrder.status === "awaiting_payment"
                                            ? "#fff3e0"
                                            : "#e8f5e9",
                                    borderRadius: "15px",
                                    padding: "4px 12px",
                                    fontSize: "13px",
                                    color:
                                        currentOrder.status === "canceled"
                                            ? "#c62828"
                                            : currentOrder.status === "awaiting_payment"
                                            ? "#fb8c00"
                                            : "#085615",
                                    fontFamily: "'DMSans-Medium', sans-serif",
                                }}>
                                {statusMap[currentOrder.status] || currentOrder.status}
                            </span>

                            <span
                                style={{
                                    background: currentOrder.debt_status === "debt" ? "red" : "#e8f5e9",
                                    borderRadius: "15px",
                                    padding: "4px 12px",
                                    fontSize: "13px",
                                    color: currentOrder.debt_status === "debt" ? "white" : "#085615",
                                    fontFamily: "'DMSans-Medium', sans-serif",
                                }}>
                                {paymentStatus(currentOrder.debt_status)}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                            style={{
                                fontFamily: "'DMSans-Medium', sans-serif",
                                color: "#085615",
                                fontSize: "18px",
                            }}>
                            {formatPrice(currentOrder.total_price)}
                        </span>

                        {currentOrder.status === "in_transit" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOrderReceived();
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
                                    Получено
                                </button>
                            )}

                        {currentOrder.status === "awaiting_payment" && (
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
                                Оплатить 1
                            </button>
                        )}
                        {currentOrder.payment_terms === "postpayment" &&
                                (currentOrder.status !== "in_processing") && (currentOrder.debt_status !== "paid" ) && (
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
                                    Оплатить2
                                </button>
                            )}

                        {(currentOrder.payment_terms === "prepayment") &&
                            currentOrder.status !== "awaiting_payment" && (
                            currentOrder.status !== "in_processing") && (currentOrder.debt_status !== "paid") && (
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
                                        marginLeft: "10px",
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
                                    Оплатить 3
                                </button>
                            )}
                    </div>
                </div>

                <div
                    style={{
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: "16px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "16px",
                        marginBottom: "10px",
                        alignItems: "start", // Добавлено для выравнивания
                    }}>
                    {/* Адрес доставки */}
                    <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                        <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>Адрес доставки:</div>
                        <div>{currentOrder.address || "Не указан"}</div>
                    </div>

                    {/* Дата доставки */}
                    <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                        <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>Дата доставки:</div>
                        <div>{formatDeliveryDate(currentOrder.delivery_date)}</div>
                    </div>

                    {/* Способ оплаты */}
                    <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                        <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>Способ оплаты:</div>
                        <div>{paymentTermsMap[currentOrder.payment_terms] || currentOrder.payment_terms}</div>
                    </div>

                    {/* Время оплаты - теперь будет корректно выравниваться */}
                    {currentOrder.payment_time && (
                        <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                            <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>Время оплаты:</div>
                            <div>{formatDeliveryDate(currentOrder.payment_time)}</div>
                        </div>
                    )}

                    {/* Документы - теперь занимает всю ширину при необходимости */}
                    {documents.length > 0 && (
                        <div
                            style={{
                                fontFamily: "'DMSans-Regular', sans-serif",
                                gridColumn: documents.length > 2 ? "1 / -1" : "auto",
                            }}>
                            <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>Документы:</div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                }}>
                                {documents.map((doc, index) => {
                                    {
                                        if (doc.contract_type === "invoice") {
                                            return;
                                        }
                                    }
                                    // Находим соответствующий контракт в константе
                                    const contractType =
                                        CONTRACTS.find((contract) => contract.name === doc.contract_type) ||
                                        CONTRACTS.find((contract) => contract.name === "other");

                                    return (
                                        <div
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(doc.file_path, doc.contract_type);
                                            }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                height: "40px",
                                                padding: "4px 8px",
                                                borderRadius: "6px",
                                                backgroundColor: "rgba(8, 86, 21, 0.05)",
                                                transition: "all 0.2s ease",
                                                border: "1px solid rgba(8, 86, 21, 0.1)",
                                                flexShrink: 0,
                                            }}
                                            title={`Скачать ${contractType.label}`}>
                                            <span
                                                style={{
                                                    marginRight: "6px",
                                                    color: doc.contract_type === "invoice" ? "#d32f2f" : "#1976d2",
                                                    opacity: 0.8,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}>
                                                {contractType.icon}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    fontFamily: "'DMSans-Medium', sans-serif",
                                                    color: "#085615",
                                                }}>
                                                {contractType.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {statusMap[currentOrder.status] === "Связь с клиентом" && (
                    <div
                        style={{
                            borderTop: "1px solid #f0f0f0",
                            paddingTop: "16px",
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}>
                        <div>
                            {currentOrder.comment && (
                                <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                                    <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>Сообщение клиенту:</div>
                                    <div style={{ fontWeight: "bold" }}>{currentOrder.comment}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div
                    style={{
                        marginTop: "16px",
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: "16px",
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
                            fontSize: "14px",
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

            <SubOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} orderContent={currentOrder.order_content} />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
                customerType={order.customer.customer_type}
                order={currentOrder}
            />
        </>
    );
};

export default OrderCard;

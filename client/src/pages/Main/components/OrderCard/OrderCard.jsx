import React from "react";

const OrderCard = ({ order }) => {
    // Status mapping for display
    const statusMap = {
        "in_processing": "В обработке",
        "awaiting_payment": "Ожидает оплаты",
        "in_assembly": "В сборке",
    };

    // Payment terms mapping
    const paymentTermsMap = {
        "prepayment": "Предоплата",
        "postpayment": "Постоплата",
        "full_payment": "Полностью оплачен"
    };
    
    // Format delivery date
    const formatDeliveryDate = (dateString) => {
        if (!dateString) return "Не указана";
        try {
            const date = new Date(dateString);
            return date.toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };
    
    // Format order ID for display
    const formatOrderId = (id) => {
        if (!id) return "—";
        return id.toString().slice(-6).padStart(6, '0');
    };

    // Format price
    const formatPrice = (price) => {
        if (!price && price !== 0) return "—";
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div
            style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                marginBottom: 20,
                border: "1px solid #f0f0f0"
            }}>
            {/* Order header with ID, status and total price */}
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
                        Заказ №{formatOrderId(order.order_id_unique)}
                    </span>
                    <span
                        style={{
                            background: order.status === "canceled" ? "#ffebee" : "#e8f5e9",
                            borderRadius: 15,
                            padding: "4px 12px",
                            fontSize: 13,
                            color: order.status === "canceled" ? "#c62828" : "#085615",
                            fontFamily: "'DMSans-Medium', sans-serif",
                        }}>
                        {statusMap[order.status] || order.status}
                    </span>
                </div>
                <span
                    style={{
                        fontFamily: "'DMSans-Medium', sans-serif",
                        color: "#085615",
                        fontSize: 18,
                    }}>
                    {formatPrice(order.total_price)}
                </span>
            </div>

            {/* Order details */}
            <div
                style={{
                    borderTop: "1px solid #f0f0f0",
                    paddingTop: 16,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "16px"
                }}>
                {/* Delivery information */}
                <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                    <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Адрес доставки:</div>
                    <div>{order.address || "Не указан"}</div>
                </div>
                
                {/* Delivery date */}
                <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                    <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Дата доставки:</div>
                    <div>{formatDeliveryDate(order.delivery_date)}</div>
                </div>
                
                {/* Payment information */}
                <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                    <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Способ оплаты:</div>
                    <div>{paymentTermsMap[order.payment_terms] || order.payment_terms}</div>
                </div>
                
                {/* Payment time if available */}
                {order.payment_time && (
                    <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                        <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Время оплаты:</div>
                        <div>{formatDeliveryDate(order.payment_time)}</div>
                    </div>
                )}
            </div>
            
            {/* Order content section if available */}
            {order.order_content && (
                <div
                    style={{
                        marginTop: 16,
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 16,
                    }}>
                    <div style={{ fontSize: 15, fontFamily: "'DMSans-Medium', sans-serif", marginBottom: 12 }}>
                        Содержимое заказа:
                    </div>
                    
                    {Array.isArray(order.order_content) && order.order_content.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                                fontFamily: "'DMSans-Regular', sans-serif",
                            }}>
                            <span>{item.name}</span>
                            <span>{item.quantity} × {formatPrice(item.price)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderCard;
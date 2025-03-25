import React, { useState, useEffect } from "react";

// Общие утилиты форматирования
const formatPrice = (price) => {
    if (!price && price !== 0) return "—";
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
    }).format(price);
};

const formatDeliveryDate = (dateString) => {
    if (!dateString) return "Не указана";
    try {
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (e) {
        return dateString;
    }
};

const formatOrderId = (id) => {
    if (!id) return "—";
    return id.toString().slice(-6).padStart(6, "0");
};

// Компонент модального окна для отображения содержимого заказа
const OrderModal = ({ isOpen, onClose, orderContent }) => {
    const [animation, setAnimation] = useState({
        overlay: { opacity: 0 },
        modal: { transform: "scale(0.8)", opacity: 0 },
    });
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Небольшая задержка перед анимацией для правильного рендеринга
            setTimeout(() => {
                setAnimation({
                    overlay: { opacity: 1 },
                    modal: { transform: "scale(1)", opacity: 1 },
                });
            }, 10);
        } else {
            setAnimation({
                overlay: { opacity: 0 },
                modal: { transform: "scale(0.8)", opacity: 0 },
            });
            // Дождаться завершения анимации перед удалением из DOM
            setTimeout(() => {
                setShouldRender(false);
            }, 300);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const handleClose = () => {
        setAnimation({
            overlay: { opacity: 0 },
            modal: { transform: "scale(0.8)", opacity: 0 },
        });
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                opacity: animation.overlay.opacity,
                transition: "opacity 0.3s ease",
            }}
            onClick={handleClose}>
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "24px",
                    maxWidth: "800px",
                    width: "90%",
                    maxHeight: "80vh",
                    overflowY: "auto",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                    transform: animation.modal.transform,
                    opacity: animation.modal.opacity,
                    transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
                onClick={(e) => e.stopPropagation()}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}>
                    <h2
                        style={{
                            fontFamily: "'DMSans-Medium', sans-serif",
                            color: "#085615",
                            margin: 0,
                        }}>
                        Содержимое заказа
                    </h2>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer",
                            color: "#666",
                            transition: "transform 0.2s ease, color 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "rotate(90deg)";
                            e.currentTarget.style.color = "#085615";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "rotate(0deg)";
                            e.currentTarget.style.color = "#666";
                        }}
                        onClick={handleClose}>
                        ×
                    </button>
                </div>

                <div>
                    {Array.isArray(orderContent) &&
                        orderContent.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    borderBottom: index < orderContent.length - 1 ? "1px solid #f0f0f0" : "none",
                                    paddingBottom: "16px",
                                    marginBottom: "16px",
                                    gap: "20px",
                                }}>
                                {/* Изображение товара */}
                                <div
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        flexShrink: 0,
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        backgroundColor: "#f5f5f5",
                                    }}>
                                    {item.product && item.product.img_path ? (
                                        <img
                                            src={item.product.img_path.replace("..\\client\\public", "")}
                                            alt={item.product.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: "#e0e0e0",
                                                color: "#666",
                                            }}>
                                            Нет фото
                                        </div>
                                    )}
                                </div>

                                {/* Информация о товаре */}
                                <div style={{ flex: 1 }}>
                                    <h3
                                        style={{
                                            fontFamily: "'DMSans-Medium', sans-serif",
                                            fontSize: "18px",
                                            marginTop: 0,
                                            marginBottom: "8px",
                                        }}>
                                        {item.product?.name || "Товар"}
                                    </h3>

                                    <div style={{ marginBottom: "12px" }}>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                                gap: "12px",
                                            }}>
                                            {item.product?.variety && (
                                                <div>
                                                    <span style={{ color: "#666", fontSize: "14px" }}>Вид:</span> {item.product.variety}
                                                </div>
                                            )}

                                            {item.quantity && (
                                                <div>
                                                    <span style={{ color: "#666", fontSize: "14px" }}>Количество:</span> {item.quantity} шт.
                                                </div>
                                            )}

                                            {item.price && (
                                                <div>
                                                    <span style={{ color: "#666", fontSize: "14px" }}>Цена за шт.:</span> {formatPrice(item.price)}
                                                </div>
                                            )}

                                            {item.total_product_price && (
                                                <div>
                                                    <span style={{ color: "#666", fontSize: "14px" }}>Сумма:</span>{" "}
                                                    <span style={{ fontFamily: "'DMSans-Medium', sans-serif", color: "#085615" }}>
                                                        {formatPrice(item.total_product_price)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {item.product?.characteristics && (
                                        <div>
                                            <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>Характеристики:</div>
                                            <div style={{ fontSize: "14px" }}>{item.product.characteristics}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

const OrderCard = ({ order }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Status mapping for display
    const statusMap = {
        in_processing: "В обработке",
        awaiting_payment: "Ожидает оплаты",
        in_assembly: "В сборке",
        awaiting_shipment: "Ожидает отправки",
        in_transit: "В пути",
        received: "Получен",
        contacting: "Связь с клиентом",
    };

    // Payment terms mapping
    const paymentTermsMap = {
        prepayment: "Предоплата",
        postpayment: "Постоплата",
        full_payment: "Полная оплата",
    };

    // Получаем количество товаров в заказе
    const getItemCount = () => {
        if (!Array.isArray(order.order_content)) return 0;
        return order.order_content.reduce((sum, item) => sum + (item.quantity || 0), 0);
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
                        gap: "16px",
                        marginBottom: "10px",
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
                {/* Если статус заказа "Связь с клиентом", отобразите кнопку сообщение */}
                {statusMap[order.status] === "Связь с клиентом" && (
                    <div
                        style={{
                            borderTop: "1px solid #f0f0f0",
                            paddingTop: 16,
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}>
                        <div>
                        {order.comment && (
                            <div style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                                <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Сообщение клиенту:</div>
                                <div style={{ fontWeight: "bold" }}>{order.comment}</div>
                            </div>
                        )}
                        </div>
                    </div>
                )}

                {/* Order content summary */}
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

            {/* Модальное окно с деталями заказа */}
            <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} orderContent={order.order_content} />
        </>
    );
};

export default OrderCard;

import React, { useState, useEffect } from "react";
import { formatPrice } from "../OrderCard/utils";

const SubOrderModal = ({ isOpen, onClose, orderContent }) => {
    const [animation, setAnimation] = useState({
        overlay: { opacity: 0 },
        modal: { transform: "scale(0.8)", opacity: 0 },
    });
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
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

export default SubOrderModal;
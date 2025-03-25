import React, { useState, useEffect } from "react";
import { Modal, Typography } from "antd";
import QRCodeImage from "./qr-code.png";

const { Title, Text } = Typography;

const PaymentModal = ({ 
    isOpen, 
    onClose, 
    onPaymentSuccess, 
    customerType, // Добавляем prop для данных пользователя
    order 
}) => {
    // Получаем customerType из userData
    console.log(customerType)

    
    const [countdown, setCountdown] = useState(5);
    const [paymentStatus, setPaymentStatus] = useState("pending");

    useEffect(() => {
        let timer;
        if (isOpen && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCount) => prevCount - 1);
            }, 1000);
        }

        if (countdown === 0) {
            setPaymentStatus("success");

            setTimeout(() => {
                onPaymentSuccess();
                onClose();
            }, 2000);
        }

        return () => clearInterval(timer);
    }, [isOpen, countdown, onPaymentSuccess, onClose]);

    if (!isOpen) return null;

    const companyDetails = {
        name: "ООО 'Лесопилька'",
        inn: "1234567890",
        kpp: "987654321",
        bik: "044525225",
        r_account: "40702810500000012345",
        k_account: "30101810400000000225",
        bank: "ПАО 'Лесоповал'",
        address: "г. Лесов, ул. Лесная, д. 1"
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={customerType === "juri" ? 700 : 450}
            style={{ textAlign: "center", padding: "24px", borderRadius: "16px" }}>
            {paymentStatus === "pending" && (
                <>
                    <Title level={4} style={{ color: "#085615", marginBottom: "20px" }}>
                        Оплата заказа
                    </Title>
                    
                    {customerType === "phys" ? (
                        <div
                            style={{
                                width: "250px",
                                height: "250px",
                                margin: "0 auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "16px",
                                overflow: "hidden",
                            }}>
                            <img
                                src={QRCodeImage}
                                alt="QR Code"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    ) : (
                        <div 
                            style={{
                                textAlign: "left", 
                                padding: "20px", 
                                backgroundColor: "#f9f9f9", 
                                borderRadius: "12px"
                            }}>
                            <Title level={5} style={{ marginBottom: "15px", color: "#085615" }}>
                                Реквизиты для оплаты
                            </Title>
                            <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "1fr 1fr", 
                                gap: "15px", 
                                marginBottom: "15px" 
                            }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Text strong style={{ marginBottom: "5px" }}>Получатель:</Text>
                                    <Text>{companyDetails.name}</Text>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Text strong style={{ marginBottom: "5px" }}>ИНН:</Text>
                                    <Text>{companyDetails.inn}</Text>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Text strong style={{ marginBottom: "5px" }}>КПП:</Text>
                                    <Text>{companyDetails.kpp}</Text>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Text strong style={{ marginBottom: "5px" }}>БИК:</Text>
                                    <Text>{companyDetails.bik}</Text>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Text strong style={{ marginBottom: "5px" }}>Р/с:</Text>
                                    <Text>{companyDetails.r_account}</Text>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Text strong style={{ marginBottom: "5px" }}>К/с:</Text>
                                    <Text>{companyDetails.k_account}</Text>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gridColumn: "1 / -1" }}>
                                    <Text strong style={{ marginBottom: "5px" }}>Банк:</Text>
                                    <Text>{companyDetails.bank}</Text>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gridColumn: "1 / -1" }}>
                                    <Text strong style={{ marginBottom: "5px" }}>Адрес:</Text>
                                    <Text>{companyDetails.address}</Text>
                                </div>
                            </div>
                            <div 
                                style={{ 
                                    backgroundColor: "#e8f5e9", 
                                    padding: "10px", 
                                    borderRadius: "8px" 
                                }}>
                                <Text strong style={{ color: "#085615" }}>
                                    Назначение платежа: Оплата заказа № {order?.order_id_unique || 'Номер не указан'}
                                </Text>
                            </div>
                        </div>
                    )}
                    
                    <div
                        style={{
                            marginTop: "20px",
                            color: "#666",
                            fontWeight: "bold",
                        }}>
                        Осталось {countdown} сек.
                    </div>
                </>
            )}

            {paymentStatus === "success" && (
                <div>
                    <Title level={4} style={{ color: "#085615" }}>
                        Оплата прошла успешно!
                    </Title>
                    <Text type="secondary">Заказ оплачен</Text>
                </div>
            )}
        </Modal>
    );
};

export default PaymentModal;
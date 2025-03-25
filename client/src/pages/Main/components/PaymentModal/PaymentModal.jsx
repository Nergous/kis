import React, { useState, useEffect } from "react";
import { Modal, Typography } from 'antd';
import QRCodeImage from './qr-code.png'; // Импорт QR-кода как статического ресурса

const { Title, Text } = Typography;

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
    const [countdown, setCountdown] = useState(5);
    const [paymentStatus, setPaymentStatus] = useState("pending");

    useEffect(() => {
        let timer;
        if (isOpen && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCount => prevCount - 1);
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

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={450}
            style={{ borderRadius: '16px' }}
            bodyStyle={{ 
                textAlign: 'center', 
                padding: '24px',
                borderRadius: '16px' 
            }}
        >
            {paymentStatus === "pending" && (
                <>
                    <Title level={4} style={{ color: "#085615", marginBottom: "20px" }}>
                        Оплата заказа
                    </Title>
                    <div style={{
                        width: "250px",
                        height: "250px",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "16px",
                        overflow: "hidden"
                    }}>
                        <img 
                            src={QRCodeImage} 
                            alt="QR Code" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '100%', 
                                objectFit: 'contain' 
                            }} 
                        />
                    </div>
                    <div style={{ 
                        marginTop: "20px", 
                        color: "#666", 
                        fontWeight: 'bold' 
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
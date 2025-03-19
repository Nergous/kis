import { Modal } from "antd";
import React from "react";
import api from "../../../../../utils/api";
import { showSuccessNotification, showErrorNotification } from "../../../../../ui/Notification/Notification";

const ChangeStatusWithConfirm = ({ orderId, order, status, visible, text, onCancel, fetchData }) => {
    const changeOrderStatus = async () => {
        try {
            const response = await api().patch(`/api/orders/${orderId}/status`, {
                status: status,
            });
            fetchData();
            showSuccessNotification(response.data.message);
            onCancel(); // Закрываем модальное окно после успешного изменения статуса
        } catch (error) {
            showErrorNotification(error.response.data.error);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            onOk={changeOrderStatus} // Передаем функцию как обработчик события
            centered
        >
            <p style={{ fontSize: "16px" }}>Заказ: {" "}<span style={{ fontWeight: "bold" }}>{order}</span></p>
            <p style={{ fontSize: "16px" }}>{text}</p>
        </Modal>
    );
};

export default ChangeStatusWithConfirm;
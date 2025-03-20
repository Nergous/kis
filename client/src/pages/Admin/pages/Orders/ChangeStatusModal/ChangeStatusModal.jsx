import React from "react";
import { Modal, Form, Select, Button, message } from "antd";
import { STATUSES } from "../../../../../constants/statuses";
import { showSuccessNotification, showErrorNotification } from "../../../../../ui/Notification/Notification";

const { Option } = Select;

const ChangeStatusModal = ({ visible, onCancel, orderId, currentStatus, onOk, allowedStatuses = [] }) => {
    const [form] = Form.useForm();

    // Фильтруем статусы, исключая текущий
    let filteredStatuses = STATUSES.filter((status) => status.value !== currentStatus);

    // Если передан allowedStatuses и он не пустой, фильтруем статусы
    if (allowedStatuses && allowedStatuses.length > 0) {
        filteredStatuses = filteredStatuses.filter((status) => allowedStatuses.includes(status.value));
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // console.log("Новый статус:", values.newStatus);
            // console.log("ID заказа:", orderId);
            onOk(orderId, values.newStatus); // Вызываем функцию onOk с новым статусом
            showSuccessNotification("Статус успешно изменен");
            onCancel(); // Закрываем модальное окно
        } catch (error) {
            showErrorNotification("Ошибка при изменении статуса:", error.response.data.error);
        }
    };

    const handleClose = () => {
        onCancel();
        form.resetFields();
    };

    return (
        <Modal
            title="Изменить статус заказа"
            open={visible}
            onCancel={handleClose}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    ОК
                </Button>,
            ]}
        >
            <Form form={form} layout="horizontal">
                <Form.Item label={`ID заказа`} >
                    <strong>{orderId}</strong>
                </Form.Item>
                <Form.Item label={`Текущий статус`}>
                    <strong>
                        {STATUSES.find((s) => s.value === currentStatus)?.label || currentStatus}
                    </strong>
                </Form.Item>
                <Form.Item
                    name="newStatus"
                    label="Новый статус"
                    rules={[{ required: true, message: "Пожалуйста, выберите новый статус!" }]}
                >
                    <Select placeholder="Выберите новый статус">
                        {filteredStatuses.map((status) => (
                            <Option key={status.value} value={status.value}>
                                {status.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangeStatusModal;
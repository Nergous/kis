import React from "react";
import { Modal, Form, Select, Button, message } from "antd";
import { STATUSES } from "../../../../../constants/statuses";

const { Option } = Select;

const ChangeStatusModal = ({ visible, onCancel, orderId, currentStatus, onOk }) => {
    const [form] = Form.useForm();

    // Фильтруем статусы, исключая текущий
    const filteredStatuses = STATUSES.filter((status) => status.value !== currentStatus);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // console.log("Новый статус:", values.newStatus);
            // console.log("ID заказа:", orderId);
            onOk(orderId, values.newStatus); // Вызываем функцию onOk с новым статусом
            message.success("Статус успешно изменен");
            onCancel(); // Закрываем модальное окно
        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
        }
    };

    return (
        <Modal
            title="Изменить статус заказа"
            open={visible}
            onCancel={onCancel}
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
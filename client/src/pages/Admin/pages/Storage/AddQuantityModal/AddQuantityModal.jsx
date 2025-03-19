import React, { useState } from "react";
import { Modal, InputNumber, Button, Form, Space } from "antd";
import api from "../../../../../utils/api";
import { showErrorNotification, showSuccessNotification } from "../../../../../ui/Notification/Notification";

const AddQuantityModal = ({ visible, onCancel, onSuccess, productId, productName, productQuantity }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Обработка отправки формы
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Отправляем запрос на сервер
            await api().patch(`/api/products/${productId}/quantity`, {
                quantity: values.quantity,
            });
            showSuccessNotification("Количество успешно добавлено");
            onSuccess(); // Закрываем модальное окно и обновляем данные
        } catch (error) {
            console.error("Ошибка при добавлении количества:", error);
            showErrorNotification("Ошибка при добавлении количества");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onCancel();
        form.resetFields();
    }

    return (
        <Modal
            title={`Добавить количество для товара: ${productName}`}
            open={visible}
            onCancel={handleClose}
            footer={null} // Убираем стандартные кнопки Modal
        >
            <h4>Текущее количество товара: {productQuantity}</h4>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                {/* Поле для ввода количества */}
                <Form.Item
                    label="Количество"
                    name="quantity"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите количество!",
                        },
                        {
                            type: "number",
                            min: 1,
                            message: "Количество должно быть больше 0!",
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Введите количество"
                    />
                </Form.Item>

                {/* Кнопки для отправки и отмены */}
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            ОК
                        </Button>
                        <Button onClick={onCancel}>Отмена</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddQuantityModal;
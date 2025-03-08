import React, { useState } from "react";
import { Modal, Input, Button, Form } from "antd";

const EditPriceModal = ({
    visible,
    onCancel,
    onSuccess,
    productId,
    productName,
    productPrice,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const price = parseFloat(values.price);
            await onSuccess(price);
        } catch (error) {
            console.error("Ошибка при обновлении цены:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={`Изменить цену для ${productName}`}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Сохранить
                </Button>,
            ]}
        >
            <Form form={form} initialValues={{ price: productPrice }}>
                <Form.Item
                    name="price"
                    label="Новая цена"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите новую цену",
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditPriceModal;

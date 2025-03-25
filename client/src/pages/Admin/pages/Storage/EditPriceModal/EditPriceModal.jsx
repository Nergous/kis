import React, { useState, useEffect } from "react";
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

    // Сбрасываем форму при каждом открытии модального окна
    useEffect(() => {
        if (visible) {
            form.setFieldsValue({ price: productPrice });
        } else {
            form.resetFields();
        }
    }, [visible, productPrice, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const price = parseFloat(values.price);
            await onSuccess(price, productId);
            form.resetFields();
        } catch (error) {
            console.error("Ошибка при обновлении цены:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={`Изменить цену для ${productName}`}
            open={visible}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
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
            <Form form={form}>
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
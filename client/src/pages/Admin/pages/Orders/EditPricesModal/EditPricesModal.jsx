import React, { useState, useEffect } from "react";
import { Modal, Table, InputNumber, Form, Button, message } from "antd";
import { showSuccessNotification, showErrorNotification } from "../../../../../ui/Notification/Notification";

const EditPricesModal = ({ visible, onCancel, orderId, orderContent, onOk }) => {
    const [form] = Form.useForm();
    const [prices, setPrices] = useState([]);

    // Инициализация prices при открытии модального окна
    useEffect(() => {
        if (visible && orderContent) {
            const initialPrices = orderContent.map((item) => ({
                ...item,
                newPrice: item.price, // Изначально новая цена равна текущей
            }));
            setPrices(initialPrices);

            // Устанавливаем начальные значения формы
            form.setFieldsValue(
                initialPrices.reduce((acc, item, index) => {
                    acc[`newPrice_${index}`] = item.newPrice;
                    return acc;
                }, {})
            );
        }
    }, [visible, orderContent, form]);

    const handlePriceChange = (index, newPrice) => {
        const updatedPrices = [...prices];
        updatedPrices[index].newPrice = newPrice;
        setPrices(updatedPrices);

        // Обновляем значение в форме
        form.setFieldsValue({
            [`newPrice_${index}`]: newPrice,
        });
    };

    const handleClose = () => {
        onCancel();
        form.resetFields();
    } 

    const handleSubmit = async () => {
        try {
            const updatedPrices = prices.map((item) => ({
                product_id: item.product_id,
                price: item.newPrice,
                total_product_price: item.newPrice * item.quantity
            }));
            const total_order_price = updatedPrices.reduce((acc, item) => acc + item.total_product_price, 0);
            // console.log("Обновленные цены:", updatedPrices);
            // console.log("ID заказа:", orderId);
            onOk(orderId, updatedPrices, total_order_price); // Вызываем функцию onOk с новыми ценами
            showSuccessNotification("Цены успешно изменены");
            onCancel(); // Закрываем модальное окно
        } catch (error) {
            showErrorNotification("Ошибка при изменении цен:", error.response.data.error);
        }
    };

    const columns = [
        {
            title: "Название товара",
            dataIndex: ["product", "name"],
            key: "name",
        },
        {
            title: "Количество",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Максимальная цена",
            dataIndex: ["product", "price"],
            key: "maxPrice",
            render: (price) => `${price}₽`,
        },
        {
            title: "Текущая цена",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price}₽`,
        },
        {
            title: "Текущая общая цена",
            key: "total_product_price",
            render: (record) => `${(record.price * record.quantity).toFixed(2)}₽`,
        },
        {
            title: "Новая цена",
            key: "newPrice",
            render: (_, record, index) => (
                <Form.Item
                    name={`newPrice_${index}`}
                    style={{ marginBottom: 0 }}
                    rules={[
                        { required: true, message: "Введите новую цену!" },
                        {
                            validator: (_, value) => {
                                if (value <= 0) {
                                    return Promise.reject("Цена должна быть больше 0");
                                }
                                if (value > record.product.price) {
                                    return Promise.reject("Новая цена не может быть больше текущей");
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <InputNumber
                        min={1}
                        max={record.product.price}
                        onChange={(value) => handlePriceChange(index, value)}
                    />
                </Form.Item>
            ),
        },
        {
            title: "Новая общая цена",
            key: "newTotalPrice",
            render: (record) => `${(record.newPrice * record.quantity).toFixed(2)}₽`,
        },
    ];

    return (
        <Modal
            title="Изменить цены заказа"
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
            width={800}
        >
            <Form form={form}>
                <Table
                    columns={columns}
                    dataSource={prices} // Используем prices как dataSource
                    rowKey="ID"
                    pagination={false}
                />
            </Form>
        </Modal>
    );
};

export default EditPricesModal;
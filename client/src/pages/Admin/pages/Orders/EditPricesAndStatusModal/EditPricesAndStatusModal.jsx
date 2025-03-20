import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Table, InputNumber, Button, message } from "antd";
import { STATUSES } from "../../../../../constants/statuses";
import { showSuccessNotification, showErrorNotification } from "../../../../../ui/Notification/Notification";

const { Option } = Select;

const EditPricesAndStatusModal = ({
    visible,
    onCancel,
    orderId,
    currentStatus,
    orderContent,
    onOk,
    allowedStatuses = [], // Добавляем параметр allowedStatuses
}) => {
    const [form] = Form.useForm();
    const [prices, setPrices] = useState([]);
    const [newStatus, setNewStatus] = useState(currentStatus);

    // Фильтруем статусы, исключая текущий
    let filteredStatuses = STATUSES.filter((status) => status.value !== currentStatus);

    // Если передан allowedStatuses и он не пустой, фильтруем статусы
    if (allowedStatuses && allowedStatuses.length > 0) {
        filteredStatuses = filteredStatuses.filter((status) => allowedStatuses.includes(status.value));
    }

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
    };

    const handleSubmit = async () => {
        try {
            const updatedPrices = prices.map((item) => ({
                product_id: item.product_id,
                price: item.newPrice,
                total_product_price: item.newPrice * item.quantity,
            }));

            const total_order_price = updatedPrices.reduce((acc, item) => acc + item.total_product_price, 0);
            onOk(orderId, newStatus, updatedPrices, total_order_price); // Вызываем функцию onOk с новым статусом и ценами
            showSuccessNotification("Цены и статус успешно изменены");
            onCancel(); // Закрываем модальное окно
        } catch (error) {
            showErrorNotification("Ошибка при изменении цен и статуса:", error.response.data.error);
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
            title="Изменить цены и статус заказа"
            open={visible}
            onCancel={handleClose}
            footer={[
                <Button key="cancel" onClick={handleClose}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    ОК
                </Button>,
            ]}
            width={800}
        >
            <Form form={form} layout="horizontal">
                <Form.Item label="ID заказа">
                    <strong>{orderId}</strong>
                </Form.Item>
                <Form.Item label="Текущий статус">
                    <strong>
                        {STATUSES.find((s) => s.value === currentStatus)?.label || currentStatus}
                    </strong>
                </Form.Item>
                <Form.Item
                    name="newStatus"
                    label="Новый статус"
                    rules={[{ required: true, message: "Пожалуйста, выберите новый статус!" }]}
                >
                    <Select
                        placeholder="Выберите новый статус"
                        onChange={(value) => setNewStatus(value)}
                    >
                        {filteredStatuses.map((status) => (
                            <Option key={status.value} value={status.value}>
                                {status.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
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

export default EditPricesAndStatusModal;
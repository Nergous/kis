import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Select,
    Table,
    InputNumber,
    Button,
    Alert,
    Input,
} from "antd";
import { STATUSES } from "../../../../../constants/statuses";
import {
    showSuccessNotification,
    showErrorNotification,
} from "../../../../../ui/Notification/Notification";

const { Option } = Select;
const { TextArea } = Input;

const EditPricesAndStatusModal = ({
    visible,
    onCancel,
    orderId,
    currentStatus,
    currentPaymentTerms,
    orderContent,
    onOk,
    allowedStatuses = [],
}) => {
    const [form] = Form.useForm();
    const [prices, setPrices] = useState([]);
    const [newStatus, setNewStatus] = useState(currentStatus);
    const [isEditingDisabled, setIsEditingDisabled] = useState(false); // Запрет редактирования
    const [info, setInfo] = useState(""); // Сообщение об ошибке или предупреждении
    const [isQuantityValid, setIsQuantityValid] = useState(true); // Проверка количества товара

    // Статусы, при которых изменение запрещено
    const disabledStatuses = [
        "in_assembly",
        "awaiting_shipment",
        "in_transit",
        "received",
    ];

    // Фильтруем статусы, исключая текущий
    let filteredStatuses = STATUSES.filter((status) => {
        // Исключаем текущий статус
        if (status.value === currentStatus) return false;
        
        // Если paymentTerms - full_payment или prepayment, исключаем in_assembly
        if ((currentPaymentTerms === "full_payment" || currentPaymentTerms === "prepayment") && 
            status.value === "in_assembly") {
            return false;
        }

        if(currentPaymentTerms === "postpayment" && status.value === "awaiting_payment") {
            return false;
        }
        
        // Если передан allowedStatuses, проверяем включение
        if (allowedStatuses.length > 0 && !allowedStatuses.includes(status.value)) {
            return false;
        }
        
        return true;
    });

    // Проверка количества товара на складе
    const validateQuantity = () => {
        let isValid = true;
        orderContent.forEach((item) => {
            if (item.product.quantity < item.quantity) {
                isValid = false;
            }
        });
        setIsQuantityValid(isValid);
        return isValid;
    };

    // Инициализация при открытии модального окна
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

            // Проверяем, запрещено ли редактирование
            if (disabledStatuses.includes(currentStatus)) {
                setIsEditingDisabled(true);
                setInfo(
                    `Статус заказа '${
                        STATUSES.find((s) => s.value === currentStatus)
                            ?.label || currentStatus
                    }'. Изменение запрещено.`
                );
                return;
            } else {
                setIsEditingDisabled(false);
            }

            // Проверяем количество товара
            const isQuantityEnough = validateQuantity();
            if (!isQuantityEnough) {
                if (currentStatus === "contacting") {
                    setInfo(
                        "Недостаточно товара на складе. Заказ уже находится в статусе 'Связь с клиентом'. Свяжитесь позже с клиентом."
                    );
                    setNewStatus("contacting");
                    form.setFieldsValue({ newStatus: "Связь с клиентом" });
                } else {
                    setInfo(
                        "Недостаточно товара на складе. Введите сообщение для клиента."
                    );
                    setNewStatus("contacting");
                    form.setFieldsValue({ newStatus: "contacting" });
                }
            } else {
                setInfo("");
                setNewStatus(null);
                form.resetFields(["newStatus"]);
            }
        }
    }, [visible, orderContent, form, currentStatus]);

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
        setInfo("");
        setNewStatus("");
    };

    const handleSubmit = async () => {
        try {
            // Если редактирование запрещено, завершаем функцию
            if (isEditingDisabled) {
                return;
            }

            const values = await form.validateFields(); // Валидация формы
            const updatedPrices = prices.map((item) => ({
                product_id: item.product_id,
                price: item.newPrice,
                total_product_price: item.newPrice * item.quantity,
            }));

            const total_order_price = updatedPrices.reduce(
                (acc, item) => acc + item.total_product_price,
                0
            );
            const message = values.message || ""; // Сообщение (если статус "contacting")

            onOk(orderId, newStatus, updatedPrices, total_order_price, message); // Вызываем функцию onOk
            showSuccessNotification("Цены и статус успешно изменены");
            onCancel(); // Закрываем модальное окно
        } catch (error) {
            showErrorNotification(
                "Ошибка при изменении цен и статуса:",
                error.response.data.error
            );
        }
    };

    const columns = [
        {
            title: "Название товара",
            dataIndex: ["product", "name"],
            key: "name",
        },
        {
            title: "Количество на складе",
            dataIndex: ["product", "quantity"],
            key: "quantity_product",
        },
        {
            title: "Количество в заказе",
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity, record) => {
                if (record.product.quantity >= quantity) {
                    return <span style={{ color: "green" }}>{quantity}</span>;
                } else {
                    return <span style={{ color: "red" }}>{quantity}</span>;
                }
            },
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
            render: (record) =>
                `${(record.price * record.quantity).toFixed(2)}₽`,
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
                                    return Promise.reject(
                                        "Цена должна быть больше 0"
                                    );
                                }
                                if (value > record.product.price) {
                                    return Promise.reject(
                                        "Новая цена не может быть больше текущей"
                                    );
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
                        disabled={isEditingDisabled} // Отключаем поле, если редактирование запрещено
                    />
                </Form.Item>
            ),
        },
        {
            title: "Новая общая цена",
            key: "newTotalPrice",
            render: (record) =>
                `${(record.newPrice * record.quantity).toFixed(2)}₽`,
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
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={isEditingDisabled} // Отключаем кнопку, если редактирование запрещено
                >
                    ОК
                </Button>,
            ]}
            width={1000}
        >
            <Form form={form} layout="horizontal">
                <Form.Item label="ID заказа">
                    <strong>{orderId}</strong>
                </Form.Item>
                <Form.Item label="Текущий статус">
                    <strong>
                        {STATUSES.find((s) => s.value === currentStatus)
                            ?.label || currentStatus}
                    </strong>
                </Form.Item>
                {info && (
                    <Alert
                        type={
                            currentStatus === "contacting" && !isQuantityValid
                                ? "info"
                                : "error"
                        }
                        message={info}
                        style={{ marginBottom: 16 }}
                    />
                )}
                {!disabledStatuses.includes(currentStatus) && (
                    <>
                        <Form.Item
                            name="newStatus"
                            label="Новый статус"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Пожалуйста, выберите новый статус!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Выберите новый статус"
                                onChange={(value) => setNewStatus(value)}
                                disabled={isEditingDisabled || !isQuantityValid} // Отключаем выбор, если редактирование запрещено или товара недостаточно
                            >
                                {filteredStatuses.map((status) => (
                                    <Option
                                        key={status.value}
                                        value={status.value}
                                        disabled={
                                            !isQuantityValid &&
                                            status.value !== "contacting"
                                        }
                                    >
                                        {status.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {((!isQuantityValid &&
                            currentStatus !== "contacting") ||
                            (newStatus === "contacting" &&
                                currentStatus !== "contacting")) && (
                            <Form.Item
                                name="message"
                                label="Сообщение"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Пожалуйста, введите сообщение!",
                                    },
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Введите сообщение"
                                />
                            </Form.Item>
                        )}

                        <Table
                            columns={columns}
                            dataSource={prices} // Используем prices как dataSource
                            rowKey="ID"
                            pagination={false}
                        />
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default EditPricesAndStatusModal;

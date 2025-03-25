import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, Table, Alert, Input } from "antd";
import { STATUSES } from "../../../../../constants/statuses";
import {
    showSuccessNotification,
    showErrorNotification,
} from "../../../../../ui/Notification/Notification";

const { Option } = Select;
const { TextArea } = Input;

const ChangeStatusModal = ({
    visible,
    onCancel,
    orderId,
    orderContent,
    currentStatus,
    onOk,
    allowedStatuses = [],
}) => {
    const [form] = Form.useForm();
    const [info, setInfo] = useState("");
    const [isQuantityValid, setIsQuantityValid] = useState(true); // Проверка количества товара
    const [isStatusChangeDisabled, setIsStatusChangeDisabled] = useState(false); // Запрет изменения статуса
    const [selectedStatus, setSelectedStatus] = useState(null); // Выбранный статус

    // Статусы, при которых изменение запрещено
    const disabledStatuses = ["in_assembly", "awaiting_shipment", "in_transit", "received"];

    // Фильтруем статусы, исключая текущий
    let filteredStatuses = STATUSES.filter(
        (status) => status.value !== currentStatus
    );

    // Если передан allowedStatuses и он не пустой, фильтруем статусы
    if (allowedStatuses && allowedStatuses.length > 0) {
        filteredStatuses = filteredStatuses.filter((status) =>
            allowedStatuses.includes(status.value)
        );
    }

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

    // При открытии модального окна проверяем количество товара и статус
    useEffect(() => {
        if (visible) {
            const isQuantityEnough = validateQuantity();

            // Если текущий статус запрещает изменение
            if (disabledStatuses.includes(currentStatus)) {
                setIsStatusChangeDisabled(true);
                setInfo(
                    `Статус заказа '${
                        STATUSES.find((s) => s.value === currentStatus)
                            ?.label || currentStatus
                    }'. Изменение статуса запрещено.`
                );
                return;
            } else {
                setIsStatusChangeDisabled(false);
            }

            if (!isQuantityEnough) {
                if (currentStatus === "contacting") {
                    setInfo(
                        "Недостаточно товара на складе. Заказ уже находится в статусе 'Связь с клиентом'. Свяжитесь позже с клиентом."
                    );
                    setSelectedStatus("contacting");
                    form.setFieldsValue({ newStatus: "Связь с клиентом" });
                } else {
                    setInfo(
                        "Недостаточно товара на складе. Введите сообщение для клиента."
                    );
                    setSelectedStatus("contacting");
                    form.setFieldsValue({ newStatus: "contacting" });
                }
            } else {
                setInfo("");
                setSelectedStatus(null);
                form.resetFields(["newStatus"]);
            }
        }
    }, [visible, currentStatus]);

    // Обработчик выбора статуса
    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        setInfo(""); // Сбрасываем сообщение об ошибке
    };

    // Обработчик отправки формы
    const handleSubmit = async () => {
        const values = await form.validateFields().catch(() => {
            return;
        }); // Валидация формы

        // Если валидация не прошла, values будет undefined
        if (!values) {
            return;
        }

        const newStatus = values.newStatus;

        // Если статус не изменен
        if (newStatus === currentStatus) {
            setInfo("Статус не изменен. Выберите другой статус.");
            return;
        }

        // Если выбран статус "contacting", проверяем сообщение
        if (
            newStatus === "contacting" &&
            !values.message &&
            currentStatus !== "contacting"
        ) {
            setInfo("Пожалуйста, введите сообщение.");
            return;
        }
        try {
            // Если все проверки пройдены, вызываем onOk
            onOk(orderId, newStatus, values.message || ""); // Передаем статус и сообщение
            showSuccessNotification("Статус успешно изменен");
            onCancel(); // Закрываем модальное окно
        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
            showErrorNotification("Ошибка при изменении статуса");
        }
    };

    const handleClose = () => {
        onCancel();
        form.resetFields();
        setInfo("");
        setSelectedStatus(null);
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
    ];

    return (
        <Modal
            title="Изменить статус заказа"
            open={visible}
            onCancel={handleClose}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={isStatusChangeDisabled} // Отключаем кнопку, если изменение статуса запрещено
                >
                    ОК
                </Button>,
            ]}
        >
            <Form form={form} layout="horizontal">
                <Form.Item label={`ID заказа`}>
                    <strong>{orderId}</strong>
                </Form.Item>
                <Form.Item label={`Текущий статус`}>
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
                        <Table
                            dataSource={orderContent}
                            columns={columns}
                            pagination={false}
                        />

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
                                onChange={handleStatusChange}
                                disabled={
                                    isStatusChangeDisabled || !isQuantityValid
                                }
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
                            (selectedStatus === "contacting" &&
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
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default ChangeStatusModal;

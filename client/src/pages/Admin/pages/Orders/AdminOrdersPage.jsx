import React, { useState, useEffect } from "react";
import {
    Table,
    Tag,
    Spin,
    ConfigProvider,
    Dropdown,
    Button,
    Space,
} from "antd";
import { DownOutlined, SyncOutlined, EditOutlined } from "@ant-design/icons";
import api from "../../../../utils/api"; // Убедитесь, что путь к api правильный
import { STATUSES } from "../../../../constants/statuses";
import { PAYMENT_TERMS } from "../../../../constants/payments_terms";

import ChangeStatusModal from "./ChangeStatusModal/ChangeStatusModal"; // Импортируем модальное окно для изменения статуса
import EditPricesModal from "./EditPricesModal/EditPricesModal"; // Импортируем модальное окно для изменения цен
import EditPricesAndStatusModal from "./EditPricesAndStatusModal/EditPricesAndStatusModal"; // Импортируем модальное окно для изменения цен и статуса
import {
    showErrorNotification,
    showSuccessNotification,
} from "../../../../ui/Notification/Notification";

const AdminOrdersPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Состояния для управления модальными окнами
    const [isChangeStatusModalVisible, setIsChangeStatusModalVisible] =
        useState(false);
    const [isEditPricesModalVisible, setIsEditPricesModalVisible] =
        useState(false);
    const [
        isEditPricesAndStatusModalVisible,
        setIsEditPricesAndStatusModalVisible,
    ] = useState(false);

    // Данные для модальных окон
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
    const [selectedOrderContent, setSelectedOrderContent] = useState([]);

    // Загрузка данных с endpoint'а
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api().get("/api/orders");
            setData(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        } finally {
            setLoading(false);
        }
    };

    const changeOrderStatus = async (id, status) => {
        try {
            const response = await api().patch(`/api/orders/${id}/status`, {
                status: status,
            });
            fetchData();
            showSuccessNotification(response.data.message);
        } catch (error) {
            showErrorNotification(error.response.data.error);
        }
    };

    const changePrices = async (id, prices, total_order_price) => {
        try {
            const response = await api().patch(
                `/api/orders/${id}/change-price`,
                { products: prices, total_order_price: total_order_price }
            );
            fetchData();
            showSuccessNotification(response.data.message);
        } catch (error) {
            showErrorNotification(error.response.data.error);
        }
    };

    const changePricesAndStatus = async (
        id,
        status,
        prices,
        total_order_price
    ) => {
        try {
            await Promise.all([
                api().patch(`/api/orders/${id}/change-price`, {
                    products: prices,
                    total_order_price: total_order_price,
                }),
                api().patch(`/api/orders/${id}/status`, { status: status }),
            ]);
            fetchData();
            showSuccessNotification("Цены и статус успешно изменены");
        } catch (error) {
            showErrorNotification(error.response.data.error);
        }
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        // Форматируем дату в формате "день.месяц.год"
        const day = String(date.getDate()).padStart(2, "0"); // День (с ведущим нулем)
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяц (с ведущим нулем)
        const year = date.getFullYear(); // Год

        return `${day}.${month}.${year}`; // Возвращаем дату в формате "день.месяц.год"
    };

    // Обработка изменения статуса
    const handleChangeStatus = (orderId, status, orderContent) => {
        setSelectedOrderId(orderId);
        setSelectedOrderStatus(status);
        setIsChangeStatusModalVisible(true);
    };

    // Обработка изменения цен
    const handleEditPrices = (orderId, orderContent) => {
        setSelectedOrderId(orderId);
        setSelectedOrderContent(orderContent);
        setIsEditPricesModalVisible(true);
    };

    // Обработка изменения цен и статуса
    const handleEditPricesAndStatus = (orderId, status, orderContent) => {
        setSelectedOrderId(orderId);
        setSelectedOrderStatus(status);
        setSelectedOrderContent(orderContent);
        setIsEditPricesAndStatusModalVisible(true);
    };

    // Элементы меню для Dropdown
    const getMenuItems = (record) => [
        {
            key: "1",
            label: (
                <Button
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                    variant="dashed"
                    type="link"
                    color="orange"
                    onClick={() =>
                        handleChangeStatus(
                            record.ID,
                            record.status,
                            record.order_content
                        )
                    }
                >
                    <SyncOutlined spin />
                    Изменить статус
                </Button>
            ),
        },
        {
            key: "2",
            label: (
                <Button
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                    color="primary"
                    variant="dashed"
                    type="link"
                    onClick={() =>
                        handleEditPrices(record.ID, record.order_content)
                    }
                >
                    <EditOutlined />
                    Изменить цены
                </Button>
            ),
        },
        {
            key: "3",
            label: (
                <Button
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                    color="geekblue"
                    variant="dashed"
                    type="link"
                    onClick={() =>
                        handleEditPricesAndStatus(
                            record.ID,
                            record.status,
                            record.order_content
                        )
                    }
                >
                    <EditOutlined />
                    Изменить цены и статус
                </Button>
            ),
        },
    ];

    // Колонки для основной таблицы
    const columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "id",
        },
        {
            title: "ID заказа",
            dataIndex: "order_id_unique",
            key: "order_id_unique",
        },
        {
            title: "Адрес доставки",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Дата доставки",
            dataIndex: "delivery_date",
            key: "delivery_date",
            render: (date) => formatDate(date), // Форматируем дату
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                // Находим соответствующий статус в массиве STATUSES
                const statusData = STATUSES.find((s) => s.value === status);
                const statusLabel = statusData ? statusData.label : status; // Если статус найден, используем label, иначе — исходное значение

                // Определяем цвет в зависимости от статуса
                let color = "default";
                switch (status) {
                    case "in_processing":
                        color = "orange";
                        break;
                    case "awaiting_payment":
                        color = "blue";
                        break;
                    case "in_assembly":
                        color = "purple";
                        break;
                    case "awaiting_shipment":
                        color = "cyan";
                        break;
                    case "in_transit":
                        color = "geekblue";
                        break;
                    case "received":
                        color = "green";
                        break;
                    case "cancelled":
                        color = "red";
                        break;
                    default:
                        color = "gray";
                }

                // Отображаем статус как Tag с цветом и читаемым названием
                return <Tag color={color}>{statusLabel}</Tag>;
            },
        },
        {
            title: "Общая стоимость заказа",
            dataIndex: "total_price",
            key: "total_price",
            render: (price) => `${price}₽`, // Добавляем символ валюты
        },
        {
            title: "Способ оплаты",
            dataIndex: "payment_terms",
            key: "payment_terms",
            render: (payment) => {
                const paymentTerm = PAYMENT_TERMS.find((p) => p.value === payment).label;
                return <Tag color="blue">{paymentTerm}</Tag>;
            },
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Dropdown
                        menu={{
                            items: getMenuItems(record),
                        }}
                        trigger={["click"]}
                    >
                        <Button>
                            Действия <DownOutlined />
                        </Button>
                    </Dropdown>
                </Space>
            ),
        },
    ];

    // Колонки для деталей заказа (expandable rows)
    const expandedRowRender = (record) => {
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
                title: "Макс. цена",
                dataIndex: ["product", "price"],
                key: "maxPrice",
                render: (price) => `${price}₽`,
            },
            {
                title: "Текущая цена",
                dataIndex: "price",
                key: "price",
            },
            {
                title: "Общая стоимость",
                dataIndex: "total_product_price",
                key: "total_product_price",
                render: (price) => `${price}₽`,
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={record.order_content}
                rowKey="ID"
                bordered
                pagination={false}
            />
        );
    };

    return (
        <div>
            <h1>Управление заказами</h1>
            {loading ? (
                <Spin
                    size="large"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 50,
                    }}
                />
            ) : (
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                cellFontSize: 16,
                            },
                        },
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="ID"
                        bordered
                        expandable={{
                            expandedRowRender, // Добавляем расширяемые строки
                            rowExpandable: (record) =>
                                record.order_content.length > 0, // Расширяем только если есть товары
                        }}
                        pagination={{ pageSize: 10 }}
                    />
                </ConfigProvider>
            )}

            {/* Модальное окно для изменения статуса */}
            <ChangeStatusModal
                visible={isChangeStatusModalVisible}
                onCancel={() => setIsChangeStatusModalVisible(false)}
                orderId={selectedOrderId}
                currentStatus={selectedOrderStatus}
                onOk={changeOrderStatus}
            />

            {/* Модальное окно для изменения цен */}
            <EditPricesModal
                visible={isEditPricesModalVisible}
                onCancel={() => setIsEditPricesModalVisible(false)}
                orderId={selectedOrderId}
                orderContent={selectedOrderContent}
                onOk={changePrices}
            />

            {/* Модальное окно для изменения цен и статуса */}
            <EditPricesAndStatusModal
                visible={isEditPricesAndStatusModalVisible}
                onCancel={() => setIsEditPricesAndStatusModalVisible(false)}
                orderId={selectedOrderId}
                currentStatus={selectedOrderStatus}
                orderContent={selectedOrderContent}
                onOk={changePricesAndStatus}
            />
        </div>
    );
};

export default AdminOrdersPage;

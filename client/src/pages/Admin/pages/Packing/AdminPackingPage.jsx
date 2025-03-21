import React, { useState, useEffect } from "react";
import { Table, Tag, Spin, ConfigProvider, Button, Empty, Image } from "antd";
import api from "../../../../utils/api"; // Убедитесь, что путь к api правильный
import { STATUSES } from "../../../../constants/statuses";
import ChangeStatusWithConfirm from "./ChangeStatusWithConfirm/ChangeStatusWithConfirm";
import CachedImage from "../../../../components/CachedImage/CachedImage";


import { showErrorNotification } from "../../../../ui/Notification/Notification";

const AdminOrdersPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Состояния для управления модальными окнами
    const [isChangeStatusModalVisible, setIsChangeStatusModalVisible] = useState(false);
    const [textConfirm, setTextConfirm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Данные для модальных окон
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);

    // Загрузка данных с endpoint'а
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api().get("/api/orders/in_assembly");
            setData(response.data);
        } catch (error) {
            showErrorNotification(error.response.data.error);
        } finally {
            setLoading(false);
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
    const handleChangeStatus = (orderId, order, status, text) => {
        setSelectedOrderId(orderId);
        setSelectedOrderStatus(status);
        setTextConfirm(text);
        setSelectedOrder(order)
        setIsChangeStatusModalVisible(true);
    };

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
                    case "in_assembly":
                        color = "purple";
                        break;
                    case "awaiting_shipment":
                        color = "cyan";
                        break;
                    default:
                        color = "gray";
                }

                // Отображаем статус как Tag с цветом и читаемым названием
                return <Tag color={color}>{statusLabel}</Tag>;
            },
        },
        {
            title: "Действия",
            key: "actions",
            width: "15%",
            render: (_, record) => {
                // Условия для отображения кнопок в зависимости от статуса
                if (record.status === "in_assembly") {
                    return (
                        <Button
                            style={{
                                display: "flex",
                                alignSelf: "center",
                            }}
                            variant="dashed"
                            type="link"
                            color="orange"
                            onClick={() => handleChangeStatus(record.ID, record.order_id_unique, "awaiting_shipment", "Вы уверены что заказ был полностью собран?")} // Пример изменения статуса
                        >
                            Заказ собран
                        </Button>
                    );
                } else if (record.status === "awaiting_shipment") {
                    return (
                        <Button
                            style={{
                                display: "flex",
                                alignSelf: "center",
                            }}
                            variant="dashed"
                            type="link"
                            color="green"
                            onClick={() => handleChangeStatus(record.ID, record.order_id_unique, "in_transit", "Заказ был отправлен?")} // Пример изменения статуса
                        >
                            Отправить
                        </Button>
                    );
                }

                // Если статус не соответствует условиям, ничего не показывать
                return null;
            },
        },
    ];

    // Колонки для деталей заказа (expandable rows)
    const expandedRowRender = (record) => {
        const columns = [
            {
                title: "Изображение",
                dataIndex: ["product", "img_path"],
                key: "img_path",
                width: "10%",
                render: (img_path) => {
                    img_path = img_path.replace(/\\/g, "/").split("public")[1];
                    return (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <CachedImage src={img_path} width={60} height={60} />
                        </div>
                    );
                },
            },
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
        ];

        return <Table columns={columns} dataSource={record.order_content} rowKey="ID" bordered pagination={false} />;
    };

    return (
        <div>
            <h1>Упаковка / отправка заказов</h1>
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
                    }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="ID"
                        bordered
                        expandable={{
                            expandedRowRender, // Добавляем расширяемые строки
                            rowExpandable: (record) => record.order_content.length > 0, // Расширяем только если есть товары
                        }}
                        pagination={{ pageSize: 10 }}
                        locale={{
                            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет заказов для сборки / отправки"></Empty>,
                        }}
                    />
                </ConfigProvider>
            )}
            <ChangeStatusWithConfirm
                orderId={selectedOrderId}
                order={selectedOrder}
                status={selectedOrderStatus}
                visible={isChangeStatusModalVisible}
                fetchData={fetchData}
                text={textConfirm}
                onCancel={() => setIsChangeStatusModalVisible(false)}
            />
        </div>
    );
};

export default AdminOrdersPage;

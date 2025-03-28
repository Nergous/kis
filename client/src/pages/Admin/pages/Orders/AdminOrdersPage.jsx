import React, { useState, useEffect } from "react";
import { Table, Tag, Spin, ConfigProvider, Dropdown, Button, Space, Modal, Descriptions, Empty } from "antd";
import { DownOutlined, SyncOutlined, EditOutlined, FilterFilled } from "@ant-design/icons";
import api from "../../../../utils/api";
import { STATUSES } from "../../../../constants/statuses";
import { PAYMENT_TERMS } from "../../../../constants/payments_terms";

import ChangeStatusModal from "./ChangeStatusModal/ChangeStatusModal";
import EditPricesModal from "./EditPricesModal/EditPricesModal";
import EditPricesAndStatusModal from "./EditPricesAndStatusModal/EditPricesAndStatusModal";
import CachedImage from "../../../../components/CachedImage/CachedImage";
import { showErrorNotification, showSuccessNotification } from "../../../../ui/Notification/Notification";
import { useAuth } from "../../../../context/AuthContext";

const AdminOrdersPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role } = useAuth();

    // Состояния для управления модальными окнами
    const [isChangeStatusModalVisible, setIsChangeStatusModalVisible] = useState(false);
    const [isEditPricesModalVisible, setIsEditPricesModalVisible] = useState(false);
    const [isEditPricesAndStatusModalVisible, setIsEditPricesAndStatusModalVisible] = useState(false);

    // Данные для модальных окон
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
    const [selectedOrderContent, setSelectedOrderContent] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [selectedPaymentTerms, setSelectedPaymentTerms] = useState(null);

    // Данные о покупателе
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedPhone, setSelectedPhone] = useState(null);

    useEffect(() => {
        document.title = "Заказы";
    }, []);

    // Загрузка данных с endpoint'а
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api().get("/api/orders");
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        } finally {
            setLoading(false);
        }
    };

    const changeOrderStatus = async (id, status, comment) => {
        try {
            const response = await api().patch(`/api/orders/${id}/status`, {
                status: status,
                comment: comment,
            });
            fetchData();
            showSuccessNotification(response.data.message);
        } catch (error) {
            showErrorNotification(error.response.data.error);
        }
    };

    const changePrices = async (id, prices, total_order_price) => {
        try {
            const response = await api().patch(`/api/orders/${id}/change-price`, { products: prices, total_order_price: total_order_price });
            fetchData();
            showSuccessNotification(response.data.message);
        } catch (error) {
            showErrorNotification(error.response.data.error);
        }
    };

    const changePricesAndStatus = async (id, status, prices, total_order_price) => {
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
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Обработка изменения статуса
    const handleChangeStatus = (orderId, status, payment_terms, order_content, comment) => {
        setSelectedOrderContent(order_content);
        setSelectedComment(comment);
        setSelectedOrderId(orderId);
        setSelectedOrderStatus(status);
        setSelectedPaymentTerms(payment_terms);
        setIsChangeStatusModalVisible(true);
    };

    // Обработка изменения цен
    const handleEditPrices = (orderId, status, orderContent) => {
        setSelectedOrderId(orderId);
        setSelectedOrderStatus(status);
        setSelectedOrderContent(orderContent);
        setIsEditPricesModalVisible(true);
    };

    // Обработка изменения цен и статуса
    const handleEditPricesAndStatus = (orderId, status, payment_terms, orderContent) => {
        setSelectedOrderId(orderId);
        setSelectedOrderStatus(status);
        setSelectedPaymentTerms(payment_terms);
        setSelectedOrderContent(orderContent);
        setIsEditPricesAndStatusModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
        setSelectedPhone(null);
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
                    onClick={() => handleChangeStatus(record.ID, record.status, record.payment_terms, record.order_content, record.comment)}>
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
                    onClick={() => handleEditPrices(record.ID, record.status, record.order_content)}>
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
                    onClick={() => handleEditPricesAndStatus(record.ID, record.status, record.payment_terms, record.order_content)}>
                    <EditOutlined />
                    Изменить цены и статус
                </Button>
            ),
        },
    ];

    // Фильтры для колонки статуса
    const statusFilters = STATUSES.map((status) => ({
        text: status.label,
        value: status.value,
    }));

    // Колонки для основной таблицы
    const columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "id",
        },
        {
            title: "Заказчик",
            dataIndex: "customer",
            key: "name",
            render: (customer, record) => {
                if (customer.customer_type === "phys") {
                    return (
                        <CustomizedTextCustomer
                            customer={customer}
                            onClick={() => {
                                setSelectedCustomer(customer);
                                setSelectedPhone(record.recipient_phone);
                                setIsModalOpen(true);
                            }}
                        />
                    );
                } else {
                    return (
                        <CustomizedTextCustomer
                            customer={customer}
                            onClick={() => {
                                setSelectedCustomer(customer);
                                setSelectedPhone(record.recipient_phone);
                                setIsModalOpen(true);
                            }}
                        />
                    );
                }
            },
        },
        {
            title: "ID заказа",
            dataIndex: "order_id_unique",
            key: "order_id_unique",
            width: "12%",
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
            render: (date) => formatDate(date),
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            filters: statusFilters,
            onFilter: (value, record) => record.status === value,
            filterIcon: (filtered) => (
                <FilterFilled
                    style={{
                        color: filtered ? "rgb(64, 150, 255)" : undefined,
                        fontSize: "20px",
                    }}
                />
            ),
            render: (status) => {
                const statusData = STATUSES.find((s) => s.value === status);
                const statusLabel = statusData ? statusData.label : status;

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

                return <Tag color={color}>{statusLabel}</Tag>;
            },
        },
        {
            title: "Общая стоимость заказа",
            dataIndex: "total_price",
            key: "total_price",
            render: (price) => `${price}₽`,
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
            title: "Задолженность",
            dataIndex: "debt_status",
            key: "debt_status",
            render: (debt) => {
                switch (debt) {
                    case "paid":
                        return <Tag color="green">Оплачен</Tag>;
                    case "not_paid":
                        return <Tag color="orange">Не оплачен</Tag>;
                    case "partial":
                        return <Tag color="blue">Частично оплачен</Tag>;
                    case "debt":
                        return <Tag color="red">Задолженность</Tag>;
                }
            },
        },
        {
            title: "Действия",
            key: "actions",
            width: "8%",
            render: (_, record) => (
                <Space size="middle">
                    <Dropdown
                        menu={{
                            items: getMenuItems(record),
                        }}
                        trigger={["click"]}
                        disabled={role === "director" || role === "accountant"}>
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
                title: "Количество на складе",
                dataIndex: ["product", "quantity"],
                key: "quantity_product",
            },
            {
                title: "Количество в заказе",
                dataIndex: "quantity",
                key: "quantity",
            },
            {
                title: "Макс. цена",
                dataIndex: ["product", "price"],
                key: "maxPrice",
                render: (price) => `${price} ₽`,
            },
            {
                title: "Текущая цена",
                dataIndex: "price",
                key: "price",
                render: (price) => `${price} ₽`,
            },
            {
                title: "Общая стоимость",
                dataIndex: "total_product_price",
                key: "total_product_price",
                render: (price) => `${price} ₽`,
            },
        ];

        return <Table columns={columns} dataSource={record.order_content} rowKey="ID" bordered pagination={false} />;
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
                    }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="ID"
                        bordered
                        expandable={{
                            expandedRowRender,
                            rowExpandable: (record) => record.order_content.length > 0,
                        }}
                        pagination={{ pageSize: 10 }}
                        locale={{
                            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нету заказов"></Empty>,
                        }}
                    />
                </ConfigProvider>
            )}

            <CustomerInfoModel selectedCustomer={selectedCustomer} phone={selectedPhone} isVisible={isModalOpen} onCancel={handleCloseModal} />

            <ChangeStatusModal
                visible={isChangeStatusModalVisible}
                onCancel={() => setIsChangeStatusModalVisible(false)}
                orderId={selectedOrderId}
                orderContent={selectedOrderContent}
                comment={selectedComment}
                currentStatus={selectedOrderStatus}
                currentPaymentTerms={selectedPaymentTerms}
                onOk={changeOrderStatus}
                allowedStatuses={["in_processing", "awaiting_payment", "in_assembly", "contacting"]}
            />

            <EditPricesModal
                visible={isEditPricesModalVisible}
                onCancel={() => setIsEditPricesModalVisible(false)}
                orderId={selectedOrderId}
                currentStatus={selectedOrderStatus}
                orderContent={selectedOrderContent}
                onOk={changePrices}
            />

            <EditPricesAndStatusModal
                visible={isEditPricesAndStatusModalVisible}
                onCancel={() => setIsEditPricesAndStatusModalVisible(false)}
                orderId={selectedOrderId}
                currentStatus={selectedOrderStatus}
                currentPaymentTerms={selectedPaymentTerms}
                orderContent={selectedOrderContent}
                onOk={changePricesAndStatus}
                allowedStatuses={["in_processing", "awaiting_payment", "in_assembly", "contacting"]}
            />
        </div>
    );
};

const CustomerInfoModel = ({ selectedCustomer, phone, isVisible, onCancel }) => {
    return (
        <Modal title="Информация о покупателе" open={isVisible} onCancel={onCancel} footer={null}>
            {selectedCustomer && (
                <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="Тип покупателя">
                        {selectedCustomer.customer_type === "phys" ? "Физическое лицо" : "Юридическое лицо"}
                    </Descriptions.Item>

                    {selectedCustomer.customer_type === "phys" ? (
                        <>
                            <Descriptions.Item label="Фамилия">{selectedCustomer.surname}</Descriptions.Item>
                            <Descriptions.Item label="Имя">{selectedCustomer.first_name}</Descriptions.Item>
                            <Descriptions.Item label="Отчество">{selectedCustomer.patronymic}</Descriptions.Item>
                        </>
                    ) : (
                        <>
                            <Descriptions.Item label="Название компании">{selectedCustomer.name}</Descriptions.Item>
                            <Descriptions.Item label="ИНН">{selectedCustomer.inn || "Не указано"}</Descriptions.Item>
                            <Descriptions.Item label="Директор компании">{selectedCustomer.director || "Не указано"}</Descriptions.Item>
                        </>
                    )}

                    <Descriptions.Item label="Email">{selectedCustomer.email || "Не указана"}</Descriptions.Item>
                    <Descriptions.Item label="Телефон">{phone || "Не указан"}</Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    );
};

const CustomizedTextCustomer = ({ customer, onClick }) => {
    const displayName = customer.customer_type === "phys" ? `${customer.first_name} ${customer.patronymic}` : customer.name;
    return (
        <div
            style={{
                cursor: "pointer",
                width: "max-content",
                borderBottom: "1px solid #1890ff",
                color: "inherit",
                transition: "color 0.3s ease, scale 0.2s ease, border-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
                e.target.style.color = "#1890ff";
                e.target.style.borderBottomColor = "#40a9ff";
                e.target.style.scale = "1.05";
            }}
            onMouseLeave={(e) => {
                e.target.style.color = "inherit";
                e.target.style.borderBottomColor = "#1890ff";
                e.target.style.scale = "1";
            }}
            onClick={onClick}>
            {displayName}
        </div>
    );
};

export default AdminOrdersPage;

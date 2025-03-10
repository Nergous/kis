import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Space,
    Spin,
    Image,
    ConfigProvider,
    Dropdown,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
    PlusOutlined,
    DownOutlined,
    SyncOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    EditOutlined,
} from "@ant-design/icons";
import api from "../../../../utils/api";
import AddQuantityModal from "./AddQuantityModal/AddQuantityModal";
import DeleteProductModal from "./DeleteProductModal/DeleteProductModal";
import EditPriceModal from "./EditPriceModal/EditPriceModal";
import {
    showErrorNotification,
    showSuccessNotification,
} from "../../../../ui/Notification/Notification";

const AdminStoragePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddQuantityModalVisible, setIsAddQuantityModalVisible] =
        useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isEditPriceModalVisible, setIsEditPriceModalVisible] =
        useState(false); // Состояние для модального окна изменения цены
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedName, setSelectedName] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null); // Состояние для хранения текущей цены
    const [role] = useState(localStorage.getItem("role")); // Получаем роль из localStorage
    const navigate = useNavigate();

    const getStorageActions = (record) => [
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
                    onClick={() => handleChange(record.ID)}
                >
                    <SyncOutlined spin />
                    Изменить продукт
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
                        handleAddQuantity(
                            record.ID,
                            record.name,
                            record.quantity
                        )
                    }
                >
                    <PlusCircleOutlined />
                    Добавить количество
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
                    type="dashed"
                    danger
                    onClick={() => handleDeleteClick(record.ID, record.name)}
                >
                    <DeleteOutlined />
                    Удалить
                </Button>
            ),
        },
    ];

    const getManagerActions = (record) => [
        {
            key: "4",
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
                        handleEditPrice(record.ID, record.name, record.price)
                    }
                >
                    <EditOutlined />
                    Изменить цену
                </Button>
            ),
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api().get("/api/products");
            setData(response.data);
        } catch (error) {
            showErrorNotification("Ошибка при загрузке данных");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api().delete(`/api/products/${id}`);
            showSuccessNotification("Продукт успешно удален");
            fetchData();
        } catch (error) {
            showErrorNotification("Ошибка при удалении продукта");
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const handleAddQuantity = (id, name, quantity) => {
        setSelectedProductId(id);
        setSelectedName(name);
        setSelectedQuantity(quantity);
        setIsAddQuantityModalVisible(true);
    };

    const handleChange = (id) => {
        const product = data.find((item) => item.ID === id);
        if (product) {
            navigate(`/admin/storage/${id}`, { state: { product } });
        }
    };

    const handleAddQuantityModalClose = () => {
        setIsAddQuantityModalVisible(false);
        setSelectedProductId(null);
        setSelectedName(null);
        setSelectedQuantity(null);
    };

    const handleQuantityAdded = () => {
        fetchData();
        setIsAddQuantityModalVisible(false);
    };

    const handleDeleteClick = (id, name) => {
        setSelectedProductId(id);
        setSelectedName(name);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalVisible(false);
        setSelectedProductId(null);
        setSelectedName(null);
    };

    const handleEditPrice = (id, name, price) => {
        setSelectedProductId(id);
        setSelectedName(name);
        setSelectedPrice(price);
        setIsEditPriceModalVisible(true);
    };

    const handleEditPriceModalClose = () => {
        setIsEditPriceModalVisible(false);
        setSelectedProductId(null);
        setSelectedName(null);
        setSelectedPrice(null);
    };

    const handlePriceUpdated = async (newPrice) => {
        try {
            await api().patch(`/api/products/${selectedProductId}/price`, {
                price: newPrice,
            });
            showSuccessNotification("Цена успешно обновлена");
            fetchData();
        } catch (error) {
            showErrorNotification("Ошибка при обновлении цены");
        } finally {
            setIsEditPriceModalVisible(false);
        }
    };

    const getMenuItems = (record) => {
        let actions = [];

        if (role === "storage") {
            actions = getStorageActions(record);
        } else if (role === "manager") {
            actions = getManagerActions(record);
        } else if (role === "admin") {
            // Для admin объединяем действия storage и manager
            actions = [
                ...getStorageActions(record),
                ...getManagerActions(record),
            ];
        }

        return actions;
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "id",
        },
        {
            title: "Изображение",
            dataIndex: "img_path",
            key: "img_path",
            render: (img_path) => {
                img_path = img_path.replace(/\\/g, "/").split("public")[1];
                return <Image src={img_path} alt="product" width={110} height={110} />;
            },
        },
        {
            title: "Наименование",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Цена",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price}₽`,
        },
        {
            title: "Количество",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Категория",
            dataIndex: "variety",
            key: "variety",
        },
        {
            title: "Характеристики",
            dataIndex: "characteristics",
            key: "characteristics",
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

    return (
        <div>
            {(role === "storage" || role === "admin") && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: 16,
                    }}
                >
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate("/admin/storage/create")}
                    >
                        Добавить новый продукт
                    </Button>
                </div>
            )}
            {loading ? (
                <Spin
                    size="large"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 50,
                    }}
                />
            ) : data.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    Нет данных в базе данных
                </div>
            ) : (
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                cellFontSize: 18,
                            },
                        },
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        loading={loading}
                    />
                </ConfigProvider>
            )}

            <AddQuantityModal
                visible={isAddQuantityModalVisible}
                onCancel={handleAddQuantityModalClose}
                onSuccess={handleQuantityAdded}
                productId={selectedProductId}
                productName={selectedName}
                productQuantity={selectedQuantity}
            />

            <DeleteProductModal
                visible={isDeleteModalVisible}
                onCancel={handleDeleteModalClose}
                onConfirm={() => handleDelete(selectedProductId)}
                productName={selectedName}
            />

            <EditPriceModal
                visible={isEditPriceModalVisible}
                onCancel={handleEditPriceModalClose}
                onSuccess={handlePriceUpdated}
                productId={selectedProductId}
                productName={selectedName}
                productPrice={selectedPrice}
            />
        </div>
    );
};

export default AdminStoragePage;

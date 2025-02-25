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
} from "@ant-design/icons";
import api from "../../../../utils/api";
import AddQuantityModal from "./AddQuantityModal/AddQuantityModal";
import DeleteProductModal from "./DeleteProductModal/DeleteProductModal";
import {
    showErrorNotification,
    showSuccessNotification,
} from "../../../../ui/Notification/Notification";

const AdminStoragePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddQuantityModalVisible, setIsAddQuantityModalVisible] =
        useState(false); // Состояние для отображения модального окна добавления количества
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Состояние для отображения модального окна удаления
    const [selectedProductId, setSelectedProductId] = useState(null); // ID выбранного продукта
    const [selectedName, setSelectedName] = useState(null); // Название выбранного продукта
    const [selectedQuantity, setSelectedQuantity] = useState(null); // Количество выбранного продукта
    const navigate = useNavigate();

    // Загрузка данных с endpoint'а
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api().get("/api/products");
            setData(response.data);
            // showSuccessNotification("Данные успешно загружены");  // Нахер не нужно
        } catch (error) {
            showErrorNotification("Ошибка при загрузке данных");
        } finally {
            setLoading(false);
        }
    };

    // Обработка удаления продукта
    const handleDelete = async (id) => {
        try {
            await api().delete(`/api/products/${id}`);
            showSuccessNotification("Продукт успешно удален");
            fetchData(); // Обновляем данные после удаления
        } catch (error) {
            showErrorNotification("Ошибка при удалении продукта");
        } finally {
            setIsDeleteModalVisible(false); // Закрываем модальное окно
        }
    };

    // Обработка добавления количества
    const handleAddQuantity = (id, name, quantity) => {
        setSelectedProductId(id); // Устанавливаем ID продукта
        setSelectedName(name); // Устанавливаем название продукта
        setSelectedQuantity(quantity); // Устанавливаем количество
        setIsAddQuantityModalVisible(true); // Открываем модальное окно
    };

    // Обработка обновления продукта
    const handleChange = (id) => {
        const product = data.find((item) => item.ID === id);
        if (product) {
            navigate(`/admin/storage/${id}`, { state: { product } });
        }
    };

    // Закрытие модального окна добавления количества
    const handleAddQuantityModalClose = () => {
        setIsAddQuantityModalVisible(false);
        setSelectedProductId(null);
        setSelectedName(null);
        setSelectedQuantity(null);
    };

    // Обновление данных после успешного добавления количества
    const handleQuantityAdded = () => {
        fetchData(); // Обновляем данные
        setIsAddQuantityModalVisible(false); // Закрываем модальное окно
    };

    // Открытие модального окна удаления
    const handleDeleteClick = (id, name) => {
        setSelectedProductId(id); // Устанавливаем ID продукта
        setSelectedName(name); // Устанавливаем название продукта
        setIsDeleteModalVisible(true); // Открываем модальное окно
    };

    // Закрытие модального окна удаления
    const handleDeleteModalClose = () => {
        setIsDeleteModalVisible(false);
        setSelectedProductId(null);
        setSelectedName(null);
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

    // Колонки таблицы
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
                return <Image src={img_path} alt="product" width={100} />;
            },
        },
        {
            title: "Название",
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
                            items: getMenuItems(record), // Используем items вместо menuItems
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
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 16,
                }}
            >
                {/* Кнопка "Добавить новый продукт" */}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/storage/create")}
                >
                    Добавить новый продукт
                </Button>
            </div>
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
                                cellFontSize: 18, // Увеличиваем шрифт в таблице
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

            {/* Модальное окно для добавления количества */}
            <AddQuantityModal
                visible={isAddQuantityModalVisible}
                onCancel={handleAddQuantityModalClose}
                onSuccess={handleQuantityAdded}
                productId={selectedProductId}
                productName={selectedName}
                productQuantity={selectedQuantity}
            />

            {/* Модальное окно для подтверждения удаления */}
            <DeleteProductModal
                visible={isDeleteModalVisible}
                onCancel={handleDeleteModalClose}
                onConfirm={() => handleDelete(selectedProductId)}
                productName={selectedName}
            />
        </div>
    );
};

export default AdminStoragePage;

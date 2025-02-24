import React, { useState, useEffect } from "react";
import { Table, Button, Space, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import api from "../../../../utils/api";

const AdminStoragePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Загрузка данных с endpoint'а
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api().get("/api/products");
            setData(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
            message.error("Не удалось загрузить данные");
        } finally {
            setLoading(false);
        }
    };

    // Обработка удаления продукта
    const handleDelete = (id) => {
        console.log("Удалить продукт с id:", id);
        // Здесь можно добавить запрос на удаление
    };

    // Обработка обновления продукта
    const handleChange = (id) => {
        const product = data.find((item) => item.id === id);
        if (product) {
            navigate(`/admin/storage/${id}`, { state: { product } });
        }
    };

    // Колонки таблицы
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Изображение",
            dataIndex: "img_path",
            key: "img_path",
            render: (img_path) => (
                <img
                    src={img_path}
                    alt="product"
                    style={{ width: 50, height: 50 }}
                />
            ),
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
            render: (price) => `$${price.toFixed(2)}`,
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
                    <Button type="link" onClick={() => handleChange(record.id)}>
                        Изменить продукт
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Удалить
                    </Button>
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
                {/* Кнопка "Обновить количество продукта" */}
                {data?.length === 0 && (
                    <Button
                        type="primary"
                        icon={<SyncOutlined />}
                        onClick={fetchData}
                        style={{ marginRight: "auto" }}
                    >
                        Обновить количество продукта
                    </Button>
                )}

                {/* Кнопка "Добавить новый продукт" */}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("#")}
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
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default AdminStoragePage;

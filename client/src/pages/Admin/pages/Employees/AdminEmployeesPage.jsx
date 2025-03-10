import React, { useState, useEffect } from "react";
import { Table, Button, Spin, ConfigProvider, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../../utils/api";
import CreateEmployeeModal from "./CreateEmployeeModal/CreateEmployeeModal";
import { showErrorNotification } from "../../../../ui/Notification/Notification";
import { ROLES } from "../../../../constants/roles";

const AdminEmployeesPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Загрузка данных с endpoint'а
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api().get("/api/workers");
            setData(response.data);
        } catch (error) {
            showErrorNotification("Ошибка при загрузке данных");
        } finally {
            setLoading(false);
        }
    };

    // Открытие модального окна
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Закрытие модального окна
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Успешная регистрация работника
    const handleSuccess = () => {
        fetchData(); // Обновляем данные
        setIsModalVisible(false); // Закрываем модальное окно
    };

    // Колонки таблицы
    const columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "id",
        },
        {
            title: "Имя",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Роль",
            dataIndex: "role",
            key: "role",
            render: (role) => {
                // Находим соответствующую роль в массиве ROLES
                const roleData = ROLES.find((r) => r.value === role);
                // Если роль найдена, возвращаем её читаемое название, иначе — исходное значение
                return <Tag color="blue">{roleData ? roleData.label : role}</Tag>;
            },
        },
        {
            title: "Логин",
            dataIndex: "login",
            key: "login",
        },
    ];

    return (
        <div>
            {/* Кнопка добавления нового работника */}
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
                    onClick={showModal}
                >
                    Зарегистрировать нового работника
                </Button>
            </div>

            {/* Таблица с работниками */}
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
                                cellFontSize: 18,
                            },
                        },
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="ID"
                        pagination={{ pageSize: 10 }}
                    />
                </ConfigProvider>
            )}

            {/* Модальное окно для регистрации нового работника */}
            <CreateEmployeeModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default AdminEmployeesPage;

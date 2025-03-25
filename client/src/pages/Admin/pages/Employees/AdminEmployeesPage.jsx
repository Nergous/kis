import React, { useState, useEffect } from "react";
import { Table, Button, Spin, ConfigProvider, Tag, Empty, Modal } from "antd";
import { PlusOutlined, UserDeleteOutlined } from "@ant-design/icons";
import api from "../../../../utils/api";
import CreateEmployeeModal from "./CreateEmployeeModal/CreateEmployeeModal";
import { showErrorNotification, showSuccessNotification } from "../../../../ui/Notification/Notification";
import { ROLES } from "../../../../constants/roles";

const AdminEmployeesPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const [isModalDeleteAccess, setIsModalDeleteAccess] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState({
        id: "",
        name: "",
        role: "",
    });

    // Загрузка данных с endpoint'а
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        document.title = "Сотрудники";
    }, [])

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

    const showModalDeleteAccess = async (id, name, role) => {
        if( role === "admin" ) return showErrorNotification("Нельзя уволить администратора");
        setIsModalDeleteAccess(true);
        setSelectedEmployee({ id, name, role });
    };

    const closeModalDeleteAccess = () => {
        setIsModalDeleteAccess(false);
        setSelectedEmployee({ id: "", name: "", role: "" });
    };

    const handleDismissEmployee = async (id) => {
        try {
            await api().delete(`/api/workers/${id}`);
            showSuccessNotification("СОТРУДНИК БЫЛ УСПЕШНО УВОЛЕН 👉🏻🗑️");
            fetchData();
        } catch (error) {
            showErrorNotification("Ошибка при уволнении сотрудника... Он защищается... ⚔️⚔️⚔️");
        }
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
            title: "Возможности",
            key: "actions",
            width: "10%",
            render: (_, record) => {
                return (
                    <Button icon={<UserDeleteOutlined />} variant="solid" color="danger" onClick={() => showModalDeleteAccess(record.ID, record.name, record.role)}>
                        УВОЛИТЬ СОТРУДНИКА
                    </Button>
                );
            },
        },
        // {
        //     title: "Логин",
        //     dataIndex: "login",
        //     key: "login",
        // },
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
                        bordered
                        pagination={{ pageSize: 10 }}
                        locale={{
                            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет сотрудников"></Empty>,
                        }}
                    />
                </ConfigProvider>
            )}

            {/* Модальное окно для регистрации нового работника */}
            <CreateEmployeeModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
            <DeleteModal
                visible={isModalDeleteAccess}
                role={selectedEmployee.role}
                name={selectedEmployee.name}
                id={selectedEmployee.id}
                onClose={closeModalDeleteAccess}
                onOk={handleDismissEmployee}
            />
        </div>
    );
};

const DeleteModal = ({ visible, role, name, id, onClose, onOk, }) => {
    const handleOk=async()=>{
        await onOk(id);
        onClose();
    }

    return (
        <Modal
            open={visible}
            title="Увольнение сотрудника"
            onCancel={onClose}
            onOk={handleOk}
        >
            <p>Вы уверены, что хотите уволить сотрудника?</p>
            <p>Роль: {role}</p>
            <p>Имя: {name}</p>
        </Modal>
    );
}

export default AdminEmployeesPage;

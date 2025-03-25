import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { ROLES } from "../../../../../constants/roles";
import {
    showSuccessNotification,
    showErrorNotification,
} from "../../../../../ui/Notification/Notification";
import api from "../../../../../utils/api";

const { Option } = Select;

const CreateEmployeeModal = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();

    const filteredRoles = ROLES.filter((role) => role.value !== "admin" && role.value !== "director");

    // Отправка формы
    const handleSubmit = async (values) => {
        try {
            await api().post("/api/workers", values);
            showSuccessNotification("Работник успешно зарегистрирован");
            onSuccess(); // Уведомляем родительский компонент об успешной регистрации
            form.resetFields(); // Очищаем форму
        } catch (error) {
            showErrorNotification("Ошибка при регистрации работника");
        }
    };

    return (
        <Modal
            title="Регистрация нового работника"
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                onSubmit={(e) => e.preventDefault()}
                layout="vertical"
            >
                {/* Поле для имени работника */}
                <Form.Item
                    label="Имя"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите имя работника!",
                        },
                    ]}
                >
                    <Input placeholder="Введите имя работника" />
                </Form.Item>

                {/* Поле для роли работника */}
                <Form.Item
                    label="Роль"
                    name="role"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, выберите роль работника!",
                        },
                    ]}
                >
                    <Select placeholder="Выберите роль">
                        {filteredRoles.map((role) => (
                            <Option key={role.value} value={role.value}>
                                {role.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Поле для логина */}
                <Form.Item
                    label="Логин"
                    name="login"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите логин!",
                        },
                    ]}
                >
                    <Input placeholder="Введите логин" />
                </Form.Item>

                {/* Поле для пароля */}
                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите пароль!",
                        },
                    ]}
                >
                    <Input.Password placeholder="Введите пароль" />
                </Form.Item>

                {/* Кнопка для отправки формы */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{margin: "0 auto"}}>
                        Зарегистрировать
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );  
};

export default CreateEmployeeModal;

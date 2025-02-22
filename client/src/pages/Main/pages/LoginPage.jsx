import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../../utils/api";
import { logIn } from "../../../utils/auth"; 
import logo_2 from "../../../logo_2.png";


const LoginPage = () => {
    const [isWorker, setIsWorker] = useState(false); // Состояние для определения, является ли пользователь сотрудником
    const [sending, setSending] = useState(false);
    const [form] = Form.useForm(); // Хук для управления формой
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Вход";
    }, []);

    const onFinish = async (values) => {
        const endpoint = isWorker ? "/api/login-worker" : "/api/login-customer";
        console.log(`Отправка данных на: ${endpoint} ${JSON.stringify(values)}`);        
        try {
            setSending(true);
            const response = await api().post(endpoint, values);
            const token = response.data.token;
            const role = response.data.role;
            logIn(token, role);
            navigate("/admin");
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        } finally {
            setSending(false);
        }
    };

    const toggleWorkerStatus = () => {
        setIsWorker(!isWorker); // Переключение между сотрудником и покупателем
        form.resetFields(); // Сброс полей формы
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "rgb(76, 175, 80)",
            }}
        >
            {/* Карточка с формой */}
            <div
                style={{
                    position: "relative", // Относительное позиционирование для карточки
                }}
            >
                {/* Логотип */}
                <img
                    src={logo_2}
                    alt="logo"
                    style={{
                        width: 350, // Размер логотипа
                        position: "absolute", // Абсолютное позиционирование относительно карточки
                        top: "-80px", // Сдвиг логотипа вверх
                        left: "50%", // Центрирование по горизонтали
                        transform: "translateX(-50%)", // Точное центрирование
                    }}
                />

                {/* Карточка с формой */}
                <Card
                    style={{
                        width: 400, // Ширина карточки
                        height: 300, // Высота карточки
                        textAlign: "center",
                        boxShadow: "0px 4px 4px 6px rgba(0, 0, 0, 0.2)",
                        borderRadius: 8, // Закруглённые углы
                    }}
                >
                    {isWorker ? (
                        <h1
                            style={{
                                fontSize: 24,
                                fontWeight: "bold",
                            }}
                        >
                            Cотрудник
                        </h1>
                    ) : (
                        <h1
                            style={{
                                fontSize: 24,
                                fontWeight: "bold",
                            }}
                        >
                            Заказчик
                        </h1>
                    )}
                    <Form
                        form={form}
                        name="login_form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        {isWorker ? (
                            <Form.Item
                                name="login"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Пожалуйста, введите ваш логин!",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Логин"
                                    style={{
                                        transition: "all 0.3s",
                                        height: 40,
                                        fontSize: 16,
                                    }}
                                />
                            </Form.Item>
                        ) : (
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Пожалуйста, введите ваш email!",
                                    },
                                    {
                                        type: "email",
                                        message: "Введите корректный email!",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Email"
                                    style={{
                                        transition: "all 0.3s",
                                        height: 40,
                                        fontSize: 16,
                                    }}
                                />
                            </Form.Item>
                        )}

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Пожалуйста, введите ваш пароль!",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Пароль"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            {sending ? (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: "100%", marginBottom: 10 }}
                                    loading
                                >
                                    Авторизация
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: "100%", marginBottom: 10 }}
                                >
                                    ВОЙТИ
                                </Button>
                            )}

                            <div
                                onClick={toggleWorkerStatus}
                                style={{
                                    color: "#1890ff",
                                    cursor: "pointer",
                                    fontSize: 14,
                                }}
                            >
                                {isWorker
                                    ? "Вы покупатель?"
                                    : "Вы являетесь работником?"}
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;

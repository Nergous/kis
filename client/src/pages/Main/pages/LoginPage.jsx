import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../../utils/api";
import { logIn } from "../../../utils/auth";
import RegLogLayout from "../layout/RegLogLayout";
import FormInput from "../../../ui/FormInput/FormInput"

// import logo_2 from "../../../logo_2.png";

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
        console.log(
            `Отправка данных на: ${endpoint} ${JSON.stringify(values)}`
        );
        try {
            setSending(true);
            const response = await api().get(endpoint, values);
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
        <RegLogLayout>
            {/* Карточка с формой */}
            <Card
                style={{
                    width: 450,
                    height: "auto",
                    textAlign: "center",
                    boxShadow: "0px 4px 4px 6px rgba(0, 0, 0, 0.2)",
                    borderRadius: 8,
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

                        // {/* Логин */}
                        <FormInput
                            name="login"
                            rules={[
                                {
                                    required: true,
                                    message: "Пожалуйста, введите ваш логин!",
                                },
                            ]}
                            placeholder="Логин"
                            prefix={<UserOutlined />}
                            type="input"
                        />
                    ) : (

                        // {/* Email */}
                        <FormInput
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Пожалуйста, введите ваш email!",
                                },
                                {
                                    type: "email",
                                    message: "Введите корректный email!",
                                },
                            ]}
                            placeholder="Email"
                            prefix={<UserOutlined />}
                            type="email"
                        />
                    )}

                    {/* Пароль */}
                    <FormInput
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Пожалуйста, введите ваш пароль!",
                            },
                        ]}
                        placeholder="Пароль"
                        prefix={<LockOutlined />}
                        type="password"
                    />
                
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div
                                onClick={() => navigate("/register")}
                                style={{
                                    color: "#1890ff",
                                    cursor: "pointer",
                                    fontSize: 14,
                                }}
                            >
                                Нет аккаунта?
                                <p style={{ fontSize: 12, color: "red" }}>(для заказчика)</p>
                            </div>
                            <div
                                onClick={toggleWorkerStatus}
                                style={{
                                    color: "#1890ff",
                                    cursor: "pointer",
                                    fontSize: 14,
                                }}
                            >
                                {isWorker
                                    ? "Вы являетесь заказчиком?"
                                    : "Вы являетесь работником?"}
                            </div>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </RegLogLayout>
    );
};

export default LoginPage;

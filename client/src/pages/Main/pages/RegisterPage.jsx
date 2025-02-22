import React, { useState } from "react";
import RegLogLayout from "../layout/RegLogLayout";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    FileDoneOutlined,
    UserAddOutlined,
    BankOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
import api from "../../../utils/api";
import styled from "styled-components";

const StyledInput = styled(Input)`
    ::-webkit-input-placeholder {
        color: black !important;
        opacity: 1 !important;
    }
`;

const StyledInputPassword = styled(Input.Password)`
    ::-webkit-input-placeholder {
        color: black !important;
        opacity: 1 !important;
    }
`;


const RegisterPage = () => {
    const [form] = Form.useForm();
    const [sending, setSending] = useState(false);

    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log("Received values:", values);
        setSending(true);

        try {
            const response = await api().post("/register", values);
            console.log("Registration successful:", response.data);
            // Перенаправление на страницу входа или другую страницу
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <RegLogLayout>
            <Card
                style={{
                    width: 450,
                    height: "auto",
                    textAlign: "center",
                    boxShadow: "0px 4px 4px 6px rgba(0, 0, 0, 0.2)",
                    borderRadius: 8,
                    padding: 20,
                }}
            >
                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 20,
                    }}
                >
                    Регистрация заказчика
                </h1>
                {/* Контейнер с прокруткой */}
                <div
                    style={{
                        maxHeight: "300px", // Ограничиваем высоту
                        overflowY: "auto", // Добавляем вертикальную прокрутку
                        paddingRight: 10, // Отступ для скроллбара
                    }}
                >
                    <Form form={form} onFinish={onFinish}>
                        {/* Имя */}
                        <Form.Item
                            name="name"
                            rules={[
                                { required: true, message: "Введите ваше имя!" },
                            ]}
                        >
                            <StyledInput
                                prefix={<UserAddOutlined />}
                                placeholder="Имя"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>

                        {/* Email */}
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Введите ваш email!" },
                                {
                                    type: "email",
                                    message: "Введите корректный email!",
                                },
                            ]}
                        >
                            <StyledInput
                                prefix={<MailOutlined />}
                                placeholder="Email"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>

                        {/* Пароль */}
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: "Введите ваш пароль!" },
                            ]}
                        >
                            <StyledInputPassword
                                prefix={<LockOutlined />}
                                placeholder="Пароль"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>

                        {/* ИНН */}
                        <Form.Item
                            name="inn"
                            rules={[
                                { required: true, message: "Введите ИНН!" },
                                { min: 12, message: "Длина ИНН должна быть 12 символов" },
                                { max: 12, message: "Длина ИНН должна быть 12 символов" },
                            ]}
                        >
                            <StyledInput
                                prefix={<FileDoneOutlined />}
                                placeholder="ИНН"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>

                        {/* Главный бухгалтер */}
                        <Form.Item
                            name="main_booker"
                            rules={[
                                {
                                    required: true,
                                    message: "Введите ФИО главного бухгалтера!",
                                },
                            ]}
                        >
                            <StyledInput
                                prefix={<UserOutlined />}
                                placeholder="Главный бухгалтер"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>

                        {/* Директор */}
                        <Form.Item
                            name="director"
                            rules={[
                                {
                                    required: true,
                                    message: "Введите ФИО директора!",
                                },
                            ]}
                        >
                            <StyledInput
                                prefix={<UserOutlined />}
                                placeholder="Директор"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>

                        {/* БИК */}
                        <Form.Item
                            name="bik"
                            rules={[
                                { required: true, message: "Введите БИК!" },
                                { min: 9, message: "Длина БИК должна быть 9 символов" },
                                { max: 9, message: "Длина БИК должна быть 9 символов" },
                            ]}
                        >
                            <StyledInput
                                prefix={<BankOutlined />}
                                placeholder="БИК"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>

                        {/* Расчетный счет */}
                        <Form.Item
                            name="payment_number"
                            rules={[
                                {
                                    required: true,
                                    message: "Введите расчетный счет!",
                                },
                                { min: 20, message: "Длина расчетного счета должна быть 20 символов" },
                                { max: 20, message: "Длина расчетного счета должна быть 20 символов" },
                            ]}
                        >
                            <StyledInput
                                prefix={<CreditCardOutlined />}
                                placeholder="Расчетный счет"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>

                        {/* Банк */}
                        <Form.Item
                            name="bank"
                            rules={[
                                {
                                    required: true,
                                    message: "Введите название банка!",
                                },
                            ]}
                        >
                            <StyledInput
                                prefix={<BankOutlined />}
                                placeholder="Банк"
                                style={{
                                    transition: "all 0.3s",
                                    height: 40,
                                    fontSize: 16,
                                }}
                            />
                        </Form.Item>
                    </Form>
                </div>

                {/* Кнопка регистрации */}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%", marginTop: 20 }}
                        loading={sending}
                        onClick={() => form.submit()}
                    >
                        Зарегистрироваться
                    </Button>
                    <div
                        onClick={() => navigate("/login")}
                        style={{
                            marginTop: 10,
                            color: "#1890ff",
                            cursor: "pointer",
                            fontSize: 14,
                        }}
                    >
                        Уже есть аккаунт?
                    </div>
                </Form.Item>
            </Card>
        </RegLogLayout>
    );
};
export default RegisterPage;

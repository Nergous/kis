import React, { useState, useEffect } from "react";
import RegLogLayout from "../layout/RegLogLayout";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    FileDoneOutlined,
    UserAddOutlined,
    BankOutlined,
    CreditCardOutlined,
    BarcodeOutlined,
} from "@ant-design/icons";
import api from "../../../utils/api";
import FormInput from "../../../ui/FormInput/FormInput"
import { logIn } from "../../../utils/auth";


const RegisterPage = () => {
    const [form] = Form.useForm();
    const [sending, setSending] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Регистрация";
    }, []);

    const onFinish = async (values) => {
        console.log("Received values:", values);
        setSending(true);

        try {
            const response = await api().post("/api/register", values);
            const token = response.data.token;
            const role = response.data.role;
            logIn(token, role);
            navigate("/admin");
            // console.log("Registration successful:", response.data);
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
                        <FormInput
                            name="name"
                            rules={[{ required: true, message: "Введите ваше имя!" }]}
                            type="input"
                            prefix={<UserAddOutlined />}
                            placeholder="Имя"
                        />


                        {/* Email */}
                        <FormInput
                            name="email"
                            rules={[
                                { required: true, message: "Введите ваш email!" },
                                {
                                    type: "email",
                                    message: "Введите корректный email!",
                                },
                            ]}
                            type="input"
                            prefix={<MailOutlined />}
                            placeholder="Email"
                        />

                        {/* Пароль */}
                        <FormInput
                            name="password"
                            rules={[
                                { required: true, message: "Введите ваш пароль!" },
                            ]}
                            type="password"
                            prefix={<LockOutlined />}
                            placeholder="Пароль"
                        />

                        {/* ИНН */}
                        <FormInput
                            name="inn"
                            rules={[
                                { required: true, message: "Введите ваш ИНН!" },
                                { min: 12, message: "Длина ИНН должна быть 12 символов" },
                                { max: 12, message: "Длина ИНН должна быть 12 символов" },
                            ]}
                            type="input"
                            prefix={<FileDoneOutlined />}
                            placeholder="ИНН"
                        />

                        {/* Главный бухгалтер */}
                        <FormInput
                            name="main_booker"
                            rules={[
                                {
                                    required: true,
                                    message: "Введите ФИО главного бухгалтера!",
                                },
                            ]}
                            type="input"
                            prefix={<UserOutlined />}
                            placeholder="Главный бухгалтер"
                        />

                        {/* Директор */}
                        <FormInput
                            name="director"
                            rules={[
                                {
                                    required: true,
                                    message: "Введите ФИО директора!",
                                },
                            ]}
                            type="input"
                            prefix={<UserOutlined />}
                            placeholder="Директор"
                        />

                        {/* БИК */}
                        <FormInput
                            name="bik"
                            rules={[
                                { required: true, message: "Введите ваш БИК!" },
                                { min: 9, message: "Длина БИК должна быть 9 символов" },
                                { max: 9, message: "Длина БИК должна быть 9 символов" },
                            ]}
                            type="input"
                            prefix={<BarcodeOutlined />}
                            placeholder="БИК"
                        />

                        {/* Расчетный счет */}
                        <FormInput
                            name="payment_number"
                            rules={[
                                {
                                    required: true,
                                    message: "Введите расчетный счет!",
                                },
                                { min: 20, message: "Длина расчетного счета должна быть 20 символов" },
                                { max: 20, message: "Длина расчетного счета должна быть 20 символов" },
                            ]}
                            type="input"
                            prefix={<CreditCardOutlined />}
                            placeholder="Расчетный счет"
                        />

                        {/* Банк */}
                        <FormInput
                            name="bank"
                            rules={[
                                {
                                    required: true,
                                    message: "Введите название банка!",
                                },
                            ]}
                            type="input"
                            prefix={<BankOutlined />}
                            placeholder="Банк"
                        />
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

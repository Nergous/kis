import React, { useState, useEffect } from "react";
import RegLogLayout from "../layout/RegLogLayout";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Tabs } from "antd";
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
import FormInput from "../../../ui/FormInput/FormInput";
import { useAuth } from "../../../context/AuthContext";
import { showErrorNotification } from "../../../ui/Notification/Notification";

const RegisterPage = () => {
    const [form] = Form.useForm();
    const [sending, setSending] = useState(false);
    const [customerType, setCustomerType] = useState("phys"); // физ лицо по умолчанию
    const { login } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Регистрация";
    }, []);
    

    const onFinish = async (values) => {
        setSending(true);
        const payload = {
            ...values,
            customer_type: customerType // Переименование ключа
        };

        try {
            console.log(payload)
            const response = await api().post("/api/register", payload);
            const token = response.data.token;
            const role = response.data.role;
            login(token, role);
            navigate("/client");
        } catch (error) {
            showErrorNotification(error.response.data.error);
        } finally {
            setSending(false);
        }
    };

    const tabItems = [
        {
            key: "phys",
            label: "Физическое лицо",
        },
        {
            key: "juri",
            label: "Юридическое лицо",
        },
    ];

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

                {/* Обновлённые Tabs */}
                <Tabs
                    items={tabItems}
                    activeKey={customerType}
                    onChange={(key) => {
                        setCustomerType(key);
                        form.resetFields();
                    }}
                    type="card"
                    centered
                />

                <div
                    style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        paddingRight: 10,
                    }}
                >
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        {/* Физ лицо */}
                        {customerType === "phys" && (
                            <>
                                <FormInput
                                    name="surname"
                                    rules={[{ required: true, message: "Введите вашу фамилию!" }]}
                                    type="input"
                                    prefix={<UserOutlined />}
                                    placeholder="Фамилия"
                                />

                                <FormInput
                                    name="first_name"
                                    rules={[{ required: true, message: "Введите ваше имя!" }]}
                                    type="input"
                                    prefix={<UserOutlined />}
                                    placeholder="Имя"
                                />

                                <FormInput
                                    name="patronymic"
                                    type="input"
                                    prefix={<UserOutlined />}
                                    placeholder="Отчество"
                                />

                                <FormInput
                                    name="email"
                                    rules={[
                                        { required: true, message: "Введите ваш email!" },
                                        { type: "email", message: "Введите корректный email!" },
                                    ]}
                                    type="input"
                                    prefix={<MailOutlined />}
                                    placeholder="Email"
                                />

                                <FormInput
                                    name="password"
                                    rules={[{ required: true, message: "Введите ваш пароль!" }]}
                                    type="password"
                                    prefix={<LockOutlined />}
                                    placeholder="Пароль"
                                />
                            </>
                        )}

                        {/* Юр лицо */}
                        {customerType === "juri" && (
                            <>
                                <FormInput
                                    name="name"
                                    rules={[{ required: true, message: "Введите ваше наименование организации!" }]}
                                    type="input"
                                    prefix={<UserAddOutlined />}
                                    placeholder="Имя"
                                />

                                <FormInput
                                    name="email"
                                    rules={[
                                        { required: true, message: "Введите ваш email!" },
                                        { type: "email", message: "Введите корректный email!" },
                                    ]}
                                    type="input"
                                    prefix={<MailOutlined />}
                                    placeholder="Email"
                                />

                                <FormInput
                                    name="password"
                                    rules={[{ required: true, message: "Введите ваш пароль!" }]}
                                    type="password"
                                    prefix={<LockOutlined />}
                                    placeholder="Пароль"
                                />

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

                                <FormInput
                                    name="main_booker"
                                    rules={[{ required: true, message: "Введите ФИО главного бухгалтера!" }]}
                                    type="input"
                                    prefix={<UserOutlined />}
                                    placeholder="Главный бухгалтер"
                                />

                                <FormInput
                                    name="director"
                                    rules={[{ required: true, message: "Введите ФИО директора!" }]}
                                    type="input"
                                    prefix={<UserOutlined />}
                                    placeholder="Директор"
                                />

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

                                <FormInput
                                    name="payment_number"
                                    rules={[
                                        { required: true, message: "Введите расчетный счет!" },
                                        { min: 20, message: "Длина расчетного счета должна быть 20 символов" },
                                        { max: 20, message: "Длина расчетного счета должна быть 20 символов" },
                                    ]}
                                    type="input"
                                    prefix={<CreditCardOutlined />}
                                    placeholder="Расчетный счет"
                                />

                                <FormInput
                                    name="bank"
                                    rules={[{ required: true, message: "Введите название банка!" }]}
                                    type="input"
                                    prefix={<BankOutlined />}
                                    placeholder="Банк"
                                />
                            </>
                        )}
                    </Form>
                </div>

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

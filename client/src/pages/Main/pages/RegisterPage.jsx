import React, { useState, useEffect } from "react";
import RegLogLayout from "../layout/RegLogLayout";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Tabs, Modal } from "antd";
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
    const [personalDataProccessing, setPersonalDataProccessing] = useState(false);
    const [termsOfPayment, setTermsOfPayment] = useState(false);
    const { login } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Регистрация";
    }, []);

    const handleOpenModal = () => {
        setPersonalDataProccessing(true);
    };

    const handleOpenTermsOfPayment = () => {
        setTermsOfPayment(true);
    };

    const handleCancelModal = () => {
        setPersonalDataProccessing(false);
    };

    const handleCancelTermsOfPayment = () => {
        setTermsOfPayment(false);
    };

    const onFinish = async (values) => {
        setSending(true);
        const payload = {
            ...values,
            customer_type: customerType, // Переименование ключа
        };

        try {
            console.log(payload);
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
                }}>
                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 20,
                    }}>
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
                    }}>
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

                                <FormInput name="patronymic" type="input" prefix={<UserOutlined />} placeholder="Отчество" />

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
                                    placeholder="Наименование организации"
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
                <div style={{ textAlign: "left" }}>
                    <span
                        style={{
                            fontSize: 12,
                            color: "rgb(24, 172, 255)",
                            display: "inline-block", // Добавлено для правильного позиционирования
                        }}
                        onClick={handleOpenModal}
                        onMouseEnter={(e) => {
                            e.target.style.cursor = "pointer";
                            e.target.style.textDecoration = "underline";
                            e.target.style.color = "rgb(0, 122, 192)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.cursor = "default";
                            e.target.style.textDecoration = "none";
                            e.target.style.color = "rgb(24, 172, 255)";
                        }}>
                        • Согласие на обработку персональных данных
                    </span>
                </div>
                <div style={{ textAlign: "left" }}>
                    <span
                        style={{
                            fontSize: 12,
                            color: "rgb(24, 172, 255)",
                            display: "inline-block", // Добавлено для правильного позиционирования
                        }}
                        onClick={handleOpenTermsOfPayment}
                        onMouseEnter={(e) => {
                            e.target.style.cursor = "pointer";
                            e.target.style.textDecoration = "underline";
                            e.target.style.color = "rgb(0, 122, 192)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.cursor = "default";
                            e.target.style.textDecoration = "none";
                            e.target.style.color = "rgb(24, 172, 255)";
                        }}>
                        • Условия оплаты заказов и доставки
                    </span>
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "100%", marginTop: 20 }} loading={sending} onClick={() => form.submit()}>
                        Зарегистрироваться
                    </Button>
                    <div
                        onClick={() => navigate("/login")}
                        style={{
                            marginTop: 10,
                            color: "#1890ff",
                            cursor: "pointer",
                            fontSize: 14,
                        }}>
                        Уже есть аккаунт?
                    </div>
                </Form.Item>
            </Card>
            <ProccessingPersonalData isVisible={personalDataProccessing} onCancel={handleCancelModal} onOk={handleCancelModal} />
            <TermsOfPaymentForOrders isVisible={termsOfPayment} onCancel={handleCancelTermsOfPayment} onOk={handleCancelTermsOfPayment} />
        </RegLogLayout>
    );
};

const ProccessingPersonalData = ({ isVisible, onCancel, onOk }) => {
    return (
        <Modal open={isVisible} onCancel={onCancel} onOk={onOk} title="Обработка персональных данных" width={800}>
            <div>
                <p style={{ fontWeight: "bold", marginTop: 0, marginBottom: 16 }}>СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</p>

                <p>
                    При регистрации Я даю свое согласие на обработку моих персональных данных, в соответствии с Федеральным законом от 27.07.2006 года
                    №152-ФЗ «О персональных данных».
                </p>

                <p>
                    Согласие распространяется на следующие персональные данные: фамилия, имя, отчество; контактная информация (адрес электронной
                    почты, номер телефона).
                </p>

                <p>
                    Согласие предоставляется на осуществление любых действий в отношении моих персональных данных, которые необходимы для достижения
                    указанных выше целей, включая (без ограничения) сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение),
                    использование, передачу третьим лицам для осуществления действий по обмену информацией, обезличивание, блокирование персональных
                    данных, а также осуществление любых иных действий, предусмотренных действующим законодательством Российской Федерации.
                </p>

                <p>
                    Я проинформирован(а), что обработка моих персональных данных будет осуществляться в соответствии с действующим законодательством
                    Российской Федерации как неавтоматизированным, так и автоматизированным способами.
                </p>

                <p>
                    Данное согласие действует до достижения целей обработки персональных данных или в течение срока хранения информации. Данное
                    согласие может быть отозвано в любой момент по моему письменному заявлению.
                </p>
            </div>
        </Modal>
    );
};

const TermsOfPaymentForOrders = ({ isVisible, onCancel, onOk }) => {
    return (
        <Modal open={isVisible} onCancel={onCancel} onOk={onOk} title="Условия оплаты заказов" width={1000} >
            <div class="payment-terms">
                <h1>Общие условия оплаты заказов</h1>

                <p>
                    Настоящие условия являются неотъемлемой частью пользовательского соглашения сервиса. Совершая заказ, вы подтверждаете согласие с
                    данными правилами.
                </p>

                <div class="section">
                    <h2>1. Общие положения</h2>
                    <p>
                        1.1. При выборе способа оплаты <strong>"Полная оплата"</strong> клиент обязан оплатить 100% стоимости заказа. В ином случае
                        заказ просто не перейдет в состояние <strong>"Сборки"</strong>.
                    </p>
                    <p>
                        1.2. При выборе способа оплаты <strong>"Предоплата"</strong> клиент обязан оплатить 30% стоимости заказа. В ином случае заказ
                        просто не перейдет в состояние <strong>"Сборки"</strong>. После оплаты 30% стоимости заказа, он переходит в состояние{" "}
                        <strong>"Сборки"</strong>. Клиент обязуется выплатить 70% стоимости заказа в течение <strong>14 календарных дней</strong> с
                        момента получения уведомления об отправке товара.
                    </p>

                    <p>
                        1.3. При выборе способа оплаты <strong>"Постоплата"</strong> клиент обязан оплатить 100% стоимости заказа в течение{" "}
                        <strong>14 календарных дней</strong> с момента получения уведомления об отправке товара.
                    </p>

                    <p>1.4. Уведомление считается полученным:</p>
                    <ul>
                        <li>При отправке на email/SMS — в момент доставки сообщения;</li>
                        <li>В личном кабинете — при изменении статуса заказа на "Отправлен".</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>2. Порядок оплаты</h2>
                    <p>2.1. Оплата производится:</p>
                    <ul>
                        <li>По реквизитам из личного кабинета;</li>
                        <li>Через платежные системы сайта.</li>
                    </ul>

                    <p>2.2. Документальным подтверждением оплаты является:</p>
                    <ul>
                        <li>Платежное поручение с отметкой банка;</li>
                        <li>Чек электронного платежа.</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>3. Последствия нарушения сроков</h2>
                    <p>3.1. При неоплате в установленный срок:</p>
                    <ul>
                        <li>Заказ аннулируется;</li>
                        <li>Товар возвращается на склад;</li>
                        <li>
                            Клиенту ставится статус <strong>"Должник"</strong> и не допускается повторное оформление.
                        </li>
                    </ul>
                </div>

                <div class="footer">
                    <p>Дата последнего обновления: 25.03.2025</p>
                </div>
            </div>
        </Modal>
    );
};

export default RegisterPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, InputNumber, Upload, Image, Card } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../../../../utils/api";
import {
    showSuccessNotification,
    showErrorNotification,
} from "../../../../../ui/Notification/Notification";
import ButtonBack from "../../../components/ButtonBack/ButtonBack";
import CardBackgroundImages from "../../../components/CardBackgroundImages/CardBackgroundImages";

const CreateProductPage = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]); // Состояние для хранения загруженных файлов
    const [previewImage, setPreviewImage] = useState(null); // Состояние для превью изображения
    const navigate = useNavigate();

    // Обработка загрузки файлов
    const handleUpload = ({ fileList }) => {
        setFileList(fileList);

        // Если файл загружен, отображаем его превью
        if (fileList.length > 0) {
            const file = fileList[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result); // Устанавливаем превью изображения
            };
            reader.readAsDataURL(file.originFileObj);
        } else {
            setPreviewImage(null); // Если файл удален, сбрасываем превью
        }
    };

    // Валидация файлов перед загрузкой
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/");
        const isAllowedFormat = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
        ].includes(file.type);

        if (!isImage || !isAllowedFormat) {
            showErrorNotification(
                "Вы можете загрузить только изображения в формате JPG, JPEG, PNG или GIF!"
            );
            return Upload.LIST_IGNORE; // Игнорируем файл, если он не подходит
        }

        const isLt2M = file.size / 1024 / 1024 < 2; // Проверка на размер файла (меньше 2MB)
        if (!isLt2M) {
            showErrorNotification("Изображение должно быть меньше 2MB!");
            return Upload.LIST_IGNORE;
        }

        return true; // Файл подходит для загрузки
    };

    // Обработка создания нового товара
    const onFinish = async (values) => {
        if (fileList.length === 0) {
            showErrorNotification(
                "Пожалуйста, загрузите изображение продукта!"
            );
            return;
        }

        // Формируем данные для отправки на бэкенд
        const formData = new FormData();
        formData.append("product_image", fileList[0].originFileObj); // Добавляем изображение
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("quantity", values.quantity);
        formData.append("variety", values.variety);
        formData.append("characteristics", values.characteristics);

        try {
            // Отправляем данные на бэкенд
            await api().post("/api/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Указываем тип контента для загрузки файлов
                },
            });
            showSuccessNotification("Продукт успешно создан");
            // form.resetFields();
            setFileList([]);
            setPreviewImage(null);
        } catch (error) {
            showErrorNotification("Не удалось создать продукт");
            // console.error("Ошибка при создании продукта:", error);
        }
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <ButtonBack navigateTo="/admin/storage" />
            <h1>Создание нового продукта</h1>
            <Form
                form={form}
                onFinish={onFinish}
                onSubmit={(e) => e.preventDefault()}
                layout="vertical"
            >
                {/* Поле для названия товара */}
                <Form.Item
                    label="Название"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите название продукта!",
                        },
                    ]}
                >
                    <Input placeholder="Введите название продукта" />
                </Form.Item>

                {/* Поле для цены товара */}
                <Form.Item
                    label="Цена"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите цену продукта!",
                        },
                        {
                            type: "number",
                            message: "Цена должна быть числом!",
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Введите цену"
                    />
                </Form.Item>

                {/* Поле для количества товара */}
                <Form.Item
                    label="Количество"
                    name="quantity"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите количество продукта!",
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Введите количество"
                    />
                </Form.Item>

                {/* Поле для вида/сорта товара */}
                <Form.Item
                    label="Вид/Сорт"
                    name="variety"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите вид/сорт продукта!",
                        },
                    ]}
                >
                    <Input placeholder="Введите вид/сорт продукта" />
                </Form.Item>

                {/* Поле для характеристик товара */}
                <Form.Item
                    label="Характеристики"
                    name="characteristics"
                    rules={[
                        {
                            required: true,
                            message:
                                "Пожалуйста, введите характеристики продукта!",
                        },
                    ]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Введите характеристики продукта"
                    />
                </Form.Item>

                {/* Поле для загрузки изображения */}
                <Form.Item
                    label="Изображение товара"
                    name="product_image"
                    rules={[
                        {
                            required: true,
                            message:
                                "Пожалуйста, загрузите изображение товара!",
                        },
                    ]}
                >
                    <Upload
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleUpload}
                        accept=".jpg,.jpeg,.png,.gif"
                        maxCount={1}
                        customRequest={({ onSuccess }) => {
                            // Отключаем автоматическую загрузку файла
                            onSuccess("ok");
                        }}
                    >
                        <Button icon={<UploadOutlined />}>
                            Загрузить изображение
                        </Button>
                    </Upload>
                </Form.Item>

                {/* Превью загруженного изображения */}
                {previewImage && (
                    <Form.Item label="Превью изображения">
                        <CardBackgroundImages width="max-content" >
                            <Image
                                width={200}
                                src={previewImage}
                                alt="Превью изображения товара"
                            />
                        </CardBackgroundImages>
                    </Form.Item>
                )}

                {/* Кнопка для отправки формы */}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Создать продукт
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateProductPage;

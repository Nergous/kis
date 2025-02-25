import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, InputNumber, message, Upload, Image } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../../../../utils/api";

const EditProductPage = () => {
    // const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]); // Состояние для хранения загруженных файлов

    // Получаем данные продукта из location.state
    const product = location.state?.product;

    // Если продукт не передан, выводим сообщение об ошибке
    if (!product) {
        return <div>Продукт не найден</div>;
    }

    // Обработка загрузки файлов
    const handleUpload = ({ fileList }) => {
        setFileList(fileList); // Обновляем состояние файлов
    };

    // Валидация файлов перед загрузкой
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/");
        const isAllowedFormat = ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type);

        if (!isImage || !isAllowedFormat) {
            message.error("Вы можете загрузить только изображения в формате JPG, JPEG, PNG или GIF!");
            return Upload.LIST_IGNORE; // Игнорируем файл, если он не подходит
        }

        const isLt2M = file.size / 1024 / 1024 < 2; // Проверка на размер файла (меньше 2MB)
        if (!isLt2M) {
            message.error("Изображение должно быть меньше 2MB!");
            return Upload.LIST_IGNORE;
        }

        return true; // Файл подходит для загрузки
    };

    // Обработка сохранения изменений
    const onFinish = async (values) => {
        console.log("Received values:", values);
        values["ID"] = product.ID;

        // Если загружено новое изображение, добавляем его в FormData
        if (fileList.length > 0) {
            const formData = new FormData();
            formData.append("image", fileList[0].originFileObj);
            formData.append("name", values.name);
            formData.append("price", values.price);
            formData.append("quantity", values.quantity);
            formData.append("variety", values.variety);
            formData.append("characteristics", values.characteristics);

            try {
                await api().patch("/api/products", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                message.success("Продукт успешно обновлен");
                navigate(-1); // Возвращаемся на предыдущую страницу
            } catch (error) {
                console.error("Ошибка при обновлении продукта:", error);
                message.error("Не удалось обновить продукт");
            }
        } else {
            // Если новое изображение не загружено, отправляем только текстовые данные
            try {
                await api().patch("/api/products", values);
                message.success("Продукт успешно обновлен");
                navigate(-1); // Возвращаемся на предыдущую страницу
            } catch (error) {
                console.error("Ошибка при обновлении продукта:", error);
                message.error("Не удалось обновить продукт");
            }
        }
    };

    // Обработка пути к изображению
    const formatImagePath = (img_path) => {
        if (!img_path) return null;
        return img_path.replace(/\\/g, "/").split("public")[1]; // Форматируем путь
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <Button type="primary" ghost icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Назад
            </Button>

            <h1>Редактирование продукта: {product.name}</h1>
            <Form form={form} initialValues={product} onFinish={onFinish} layout="vertical">
                {/* Поле для названия товара */}
                <Form.Item label="Название" name="name">
                    <Input />
                </Form.Item>

                {/* Поле для цены товара */}
                <Form.Item label="Цена" name="price">
                    <InputNumber min={0} />
                </Form.Item>

                {/* Поле для количества товара */}
                <Form.Item label="Количество" name="quantity">
                    <InputNumber min={0} />
                </Form.Item>

                {/* Поле для вида/сорта товара */}
                <Form.Item label="Вид/Сорт" name="variety">
                    <Input />
                </Form.Item>

                {/* Поле для характеристик товара */}
                <Form.Item label="Характеристики" name="characteristics">
                    <Input.TextArea />
                </Form.Item>

                {/* Поле для загрузки изображения */}
                <Form.Item label="Изображение товара" name="image">
                    <Upload
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleUpload}
                        accept=".jpg,.jpeg,.png,.gif"
                        maxCount={1} // Разрешаем загружать только один файл
                        customRequest={({ onSuccess }) => {
                            onSuccess("ok"); // Отключаем автоматическую загрузку
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Загрузить новое изображение</Button>
                    </Upload>
                </Form.Item>

                {/* Предпросмотр текущего изображения */}
                {product.img_path && (
                    <Form.Item label="Текущее изображение">
                        <Image
                            width={200}
                            src={`${formatImagePath(product.img_path)}`} // Укажите правильный базовый URL
                            alt="Текущее изображение товара"
                        />
                    </Form.Item>
                )}

                {/* Кнопка для сохранения изменений */}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Сохранить изменения
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditProductPage;
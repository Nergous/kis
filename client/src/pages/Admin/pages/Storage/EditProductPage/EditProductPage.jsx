import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, InputNumber, Upload, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../../../../utils/api";
import {
    showErrorNotification,
    showSuccessNotification,
} from "../../../../../ui/Notification/Notification";
import ButtonBack from "../../../components/ButtonBack/ButtonBack";
import CardBackgroundImages from "../../../components/CardBackgroundImages/CardBackgroundImages";

const EditProductPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]); // Состояние для хранения загруженных файлов
    const [newImage, setNewImage] = useState(null); // Состояние для хранения нового изображения

    // Получаем данные продукта из location.state
    const product = location.state?.product;

    // Если продукт не передан, выводим сообщение об ошибке
    if (!product) {
        return <div>Продукт не найден</div>;
    }

    // Обработка загрузки файлов
    const handleUpload = ({ fileList }) => {
        setFileList(fileList); // Обновляем состояние файлов
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj;
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewImage(e.target.result); // Устанавливаем новое изображение
            };
            reader.readAsDataURL(file); // Читаем файл как Data URL
        } else {
            setNewImage(null); // Если файл удален, сбрасываем новое изображение
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

    // Обработка сохранения изменений
    const onFinish = async (values) => {
        const img_path = product.img_path; // ЕБУЧИЙ КОСТЫЛЬ
        values["ID"] = product.ID;

        // Если загружено новое изображение, добавляем его в FormData
        if (fileList.length > 0) {
            const formData = new FormData();
            formData.append("ID", values.ID);
            formData.append("name", values.name);
            // formData.append("price", values.price);
            formData.append("quantity", values.quantity);
            formData.append("variety", values.variety);
            formData.append("characteristics", values.characteristics);
            formData.append("product_image", fileList[0].originFileObj);
            formData.append("img_path", img_path);

            try {
                await api().patch("/api/products", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                showSuccessNotification(
                    "Продукт с новым изображением успешно обновлен"
                );
                navigate("/admin/storage"); // Возвращаемся на предыдущую страницу
            } catch (error) {
                console.error("Ошибка при обновлении продукта:", error);
                showErrorNotification("Не удалось обновить продукт");
            }
        } else {
            // Если новое изображение не загружено, отправляем только текстовые данные
            try {
                await api().patch("/api/products", values);
                showSuccessNotification("Продукт успешно обновлен");
                navigate(-1); // Возвращаемся на предыдущую страницу
            } catch (error) {
                console.error("Ошибка при обновлении продукта:", error);
                showErrorNotification("Не удалось обновить продукт");
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
            <ButtonBack navigateTo={-1} />

            <h1>Редактирование продукта: {product.name}</h1>
            <Form
                form={form}
                initialValues={product}
                onFinish={onFinish}
                layout="vertical"
            >
                {/* Поле для названия товара */}
                <Form.Item label="Наименование" name="name">
                    <Input />
                </Form.Item>

                {/* Поле для вида/сорта товара */}
                <Form.Item label="Вид/Сорт" name="variety">
                    <Input />
                </Form.Item>

                {/* Поле для характеристик товара */}
                <Form.Item label="Характеристики" name="characteristics">
                    <Input.TextArea />
                </Form.Item>

                {/* Поле для цены товара */}
                <Form.Item
                    label={
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            Цена{" "}
                            <span style={{ color: "red", fontSize: 10 }}>
                                (назначает менеджер)
                            </span>
                        </div>
                    }
                    name="price"
                >
                    <InputNumber min={0} disabled />
                </Form.Item>

                {/* Поле для количества товара */}
                <Form.Item label="Количество (куб. м)" name="quantity">
                    <InputNumber min={0} />
                </Form.Item>

                {/* Поле для загрузки изображения */}
                <Form.Item label="Изображение товара" name="img_path">
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
                        <Button icon={<UploadOutlined />}>
                            Загрузить новое изображение
                        </Button>

                        {/* Для Upload.Dragger
                         <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Нажмите или перетащите файл для загрузки
                        </p>
                        <p className="ant-upload-hint">
                            Поддерживаются только файлы в формате JPG, JPEG, PNG
                            или GIF (макс. 2MB)
                        </p>  */}
                    </Upload>
                </Form.Item>

                {/* Предпросмотр текущего и нового изображения */}
                <Form.Item label="Изображения">
                    <CardBackgroundImages width="90%">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            {/* Текущее изображение */}
                            {product.img_path && (
                                <div>
                                    <div
                                        style={{
                                            textAlign: "center",
                                            marginBottom: 8,
                                            fontWeight: "bold",
                                            fontFamily:
                                                "'DMSans-Medium', sans-serif",
                                        }}
                                    >
                                        Текущее изображение
                                    </div>
                                    <Image
                                        width={200}
                                        src={`${formatImagePath(
                                            product.img_path
                                        )}`}
                                        alt="Текущее изображение товара"
                                    />
                                </div>
                            )}
                            {/* Новое загруженное изображение */}
                            {newImage && (
                                <div>
                                    <div
                                        style={{
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            marginBottom: 8,
                                            fontFamily:
                                                "'DMSans-Medium', sans-serif",
                                        }}
                                    >
                                        Новое изображение
                                    </div>
                                    <Image
                                        width={200}
                                        src={newImage}
                                        alt="Новое изображение товара"
                                    />
                                </div>
                            )}
                        </div>
                    </CardBackgroundImages>
                </Form.Item>

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

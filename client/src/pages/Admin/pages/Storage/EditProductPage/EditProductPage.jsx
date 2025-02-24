import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button, Form, Input, InputNumber, message } from "antd";
import api from "../../../../../utils/api";

const EditProductPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [form] = Form.useForm();

    // Получаем данные продукта из location.state
    const product = location.state?.product;

    // Если продукт не передан, выводим сообщение об ошибке
    if (!product) {
        return <div>Продукт не найден</div>;
    }

    // Обработка сохранения изменений
    const onFinish = async (values) => {
        try {
            await api().put(`/api/products/${id}`, values);
            message.success("Продукт успешно обновлен");
        } catch (error) {
            console.error("Ошибка при обновлении продукта:", error);
            message.error("Не удалось обновить продукт");
        }
    };

    return (
        <div>
            <h1>Редактирование продукта: {product.name}</h1>
            <Form
                form={form}
                initialValues={product}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item label="Название" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="Цена" name="price">
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Количество" name="quantity">
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Категория" name="variety">
                    <Input />
                </Form.Item>
                <Form.Item label="Характеристики" name="characteristics">
                    <Input.TextArea />
                </Form.Item>
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
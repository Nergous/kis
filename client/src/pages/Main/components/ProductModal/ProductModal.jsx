import React from "react";
import { Modal, Button } from "antd";

const ProductModal = ({ product, visible, onClose, addToCart }) => {
    if (!product) {
        return null; // Если product равен null, ничего не рендерим
    }

    // Функция для корректировки пути к изображению
    const imgSlashChange = (img_path) => {
        img_path = img_path.replace(/\\/g, "/").split("public")[1];
        return img_path;
    };

    return (
        <Modal
            title={product.name} // Используем product.name
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="addToCart" type="primary" onClick={() => addToCart(product)}>
                    Добавить в корзину
                </Button>,
                <Button key="close" onClick={onClose}>
                    Закрыть
                </Button>,
            ]}
        >
            {/* Изображение товара */}
            <img
                src={imgSlashChange(product.img_path)} // Используем product.img_path
                alt={product.name}
                style={{ width: "100%", marginBottom: 20 }}
            />

            {/* Цена товара */}
            <p>
                <strong>Цена:</strong> {product.price} руб. {/* Используем product.price */}
            </p>

            {/* Количество товара */}
            <p>
                <strong>Количество:</strong> {product.quantity} {/* Используем product.quantity */}
            </p>

            {/* Разновидность товара */}
            <p>
                <strong>Разновидность:</strong> {product.variety} {/* Используем product.variety */}
            </p>

            {/* Описание товара */}
            <p>
                <strong>Описание:</strong> {product.characteristics} {/* Используем product.characteristics */}
            </p>
        </Modal>
    );
};

export default ProductModal;
import React from "react";
import { Modal, Button, Descriptions, Image, Tag } from "antd";
import { DollarOutlined, ShoppingCartOutlined, TagOutlined, InfoCircleOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import CachedImage from "../../../../components/CachedImage/CachedImage";

const ProductModal = ({ product, visible, onClose, addToCart }) => {
    if (!product) return null;

    // Функция для обработки пути к изображению
    const imgSlashChange = (img_path) => {
        try {
            return img_path?.replace(/\\/g, "/").split("public")[1].replace("//", "/");
        } catch {
            return "/placeholder-image.jpg"; // Запасное изображение
        }
    };

    // Определение статуса товара
    const productStatus = product.quantity > 0 ? { text: "В наличии", color: "green" } : { text: "Нет в наличии", color: "red" };

    return (
        <Modal
            title={<span style={{ fontSize: "1.5em", fontWeight: 600 }}>{product.name}</span>}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Закрыть
                </Button>,
                <Button
                    key="addToCart"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => addToCart(product)}
                    disabled={product.quantity <= 0}
                    style={{ background: "#4caf50", borderColor: "#45a049" }}>
                    Добавить в корзину
                </Button>,
            ]}
            width={800}
            transitionName="zoom"
            maskTransitionName="fade"
            bodyStyle={{ padding: "24px" }}>
            <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
                <CachedImage
                    src={imgSlashChange(product.img_path)}
                    alt={product.name}
                    width={300}
                    height={300} // или любое другое значение, которое вам нужно
                    style={{
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        flexShrink: 0,
                    }}
                    preview={{
                        maskClassName: "image-preview-mask",
                        mask: <span style={{ color: "white" }}>Просмотр</span>,
                    }}
                />
                {/* <Image
          src={imgSlashChange(product.img_path)}
          alt={product.name}
          style={{
            width: "300px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            flexShrink: 0
          }}
          preview={{
            maskClassName: "image-preview-mask",
            mask: <span style={{ color: "white" }}>Просмотр</span>
          }}
        /> */}

                <Descriptions
                    bordered
                    column={1}
                    labelStyle={{
                        width: "140px",
                        fontWeight: 500,
                        backgroundColor: "#fafafa",
                    }}
                    contentStyle={{ fontSize: "1em" }}>
                    <Descriptions.Item
                        label={
                            <span>
                                <DollarOutlined style={{ marginRight: 8, color: "#4caf50" }} />
                                Цена
                            </span>
                        }>
                        <span style={{ fontSize: "1.2em", fontWeight: 600 }}>{product.price.toLocaleString()} ₽</span>
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={
                            <span>
                                <SafetyCertificateOutlined style={{ marginRight: 8, color: "#4caf50" }} />
                                Статус
                            </span>
                        }>
                        <Tag color={productStatus.color} style={{ fontSize: "1em" }}>
                            {productStatus.text}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={
                            <span>
                                <TagOutlined style={{ marginRight: 8, color: "#4caf50" }} />
                                Вид/Сорт
                            </span>
                        }>
                        <Tag color="geekblue" style={{ fontSize: "1em" }}>
                            {product.variety}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={
                            <span>
                                <InfoCircleOutlined style={{ marginRight: 8, color: "#4caf50" }} />
                                Описание
                            </span>
                        }
                        span={2}>
                        <div
                            style={{
                                whiteSpace: "pre-wrap",
                                lineHeight: 1.6,
                                padding: "12px",
                                backgroundColor: "#f8f8f8",
                                borderRadius: "8px",
                            }}>
                            {product.characteristics}
                        </div>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Modal>
    );
};

export default ProductModal;

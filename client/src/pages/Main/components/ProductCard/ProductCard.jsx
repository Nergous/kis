import React from "react";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CachedImage from "../../../../components/CachedImage/CachedImage";

const ProductCard = ({ product, addToCart, onProductClick }) => {
    // Функция для корректировки пути к изображению
    const imgSlashChange = (img_path) => {
        img_path = img_path.replace(/\\/g, "/").split("public")[1];
        return img_path;
    };

    return (
        <div
            style={{
                background: "white",
                borderRadius: "20px",
                padding: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                width: "90%",
                maxWidth: "300px",
                position: "relative",
                transition: "transform 0.2s ease-in-out",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => onProductClick(product)} // Открываем модальное окно при клике
        >
            {/* Название товара */}
            <h3
                style={{
                    fontSize: "20px",
                    margin: 0,
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DMSans-Medium', sans-serif",
                    color: "rgb(8, 86, 21)",
                }}
            >
                {product.name} {/* Используем product.name */}
            </h3>

            {/* Изображение товара */}
            <CachedImage
                src={imgSlashChange(product.img_path)} // Используем product.img_path
                alt={product.name}
                width="100%"
                height="250px"
                style={{
                    objectFit: "cover",
                    borderRadius: "12px",
                }}
                preview={false}
            />

            {/* Цена и кнопка добавления в корзину */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 10px",
                }}
            >
                {/* Цена */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        background: "#e8f5e9",
                        borderRadius: "20px",
                        padding: "6px 15px",
                        gap: "4px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            fontFamily: "'DMSans-Medium', sans-serif",
                        }}
                    >
                        {product.price} {/* Используем product.price */}
                    </span>
                    <span
                        style={{
                            fontSize: "12px",
                            color: "#666",
                            fontFamily: "'DMSans-Medium', sans-serif",
                        }}
                    >
                        /{" ₽"}
                    </span>
                </div>

                {/* Кнопка добавления в корзину */}
                <IconButton
                    style={{
                        background: "#4caf50",
                        color: "white",
                        borderRadius: "50%",
                        padding: "8px",
                    }}
                    onClick={(e) => {
                        e.stopPropagation(); // Останавливаем всплытие события
                        addToCart(product);
                    }}
                >
                    <ShoppingCartIcon fontSize="small" />
                </IconButton>
            </div>
        </div>
    );
};

export default ProductCard;
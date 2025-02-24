import React from "react";
import { Row, Col } from "antd";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "antd/dist/reset.css";
import "../../../fonts.css";

const products = [
    { title: "Брус клеёный", price: "1.110₽ /шт", image: "image1.png" },
    {
        title: "Доска обрезная хвойных пород",
        price: "10.050₽ /м3",
        image: "image2.png",
    },
    { title: "Рейка деревянная", price: "17₽ /пм", image: "image3.png" },
    {
        title: "Брус с ленточным распилом",
        price: "20.500₽ /м3",
        image: "image4.png",
    },
    { title: "Брусок строганный сухой", price: "35₽ /пм", image: "image5.png" },
    {
        title: "Доска сухая строганная",
        price: "1.370₽ /шт",
        image: "image6.png",
    },
    {
        title: "Доска сухая строганная (сосна)",
        price: "140₽ /шт",
        image: "image7.png",
    },
    { title: "Лист фанеры", price: "420₽ /л", image: "image8.png" },
];

// жоска зарефакторил
const MainPage = () => {
    return (
        <Row gutter={[5, 100]} justify="center">
            {products.map((product, index) => {
                const [price, measure] = product.price.split(/р?\//);

                return (
                    <Col
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        key={index}
                        style={{ display: "flex", justifyContent: "center" }}
                    >
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
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        >
                            {/* Название над изображением */}
                            <h3 style={{ 
                                fontSize: "20px", 
                                margin: 0,
                                minHeight: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "'DMSans-Medium', sans-serif",
                                color: "rgb(8, 86, 21)"
                            }}>
                                {product.title}
                            </h3>
                            {/* Изображение */}
                            <img
                                src={product.image}
                                alt={product.title}
                                style={{
                                    width: "100%",
                                    height: "250px",
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                }}
                            />

                            {/* Контейнер для цены и кнопки */}
                            <div style={{ 
                                display: "flex", 
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0 10px"
                            }}>
                                {/* Овал с ценой */}
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
                                    <span style={{ 
                                        fontSize: "16px", 
                                        fontWeight: "bold",
                                        fontFamily: "'DMSans-Medium', sans-serif"
                                    }}>
                                        {price.trim()}
                                    </span>
                                    <span style={{ 
                                        fontSize: "12px", 
                                        color: "#666",
                                        fontFamily: "'DMSans-Medium', sans-serif"
                                    }}>
                                        /{measure.trim()}
                                    </span>
                                </div>

                                {/* Кнопка корзины */}
                                <IconButton
                                    style={{
                                        background: "#4caf50",
                                        color: "white",
                                        borderRadius: "50%",
                                        padding: "8px",
                                    }}
                                >
                                    <ShoppingCartIcon fontSize="small" />
                                </IconButton>
                            </div>
                        </div>
                    </Col>
                );
            })}
        </Row>
    );
};

export default MainPage;

import React from "react";
import { Row, Col } from "antd";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "antd/dist/reset.css";

const products = [
    { title: "Брус клеёный", price: "1110 р/шт", image: "image1.png" },
    {
        title: "Доска обрезная хвойных пород",
        price: "10050 р/м3",
        image: "image2.png",
    },
    { title: "Рейка деревянная", price: "17 р/пм", image: "image3.png" },
    {
        title: "Брус с ленточным распилом",
        price: "20500 р/м3",
        image: "image4.png",
    },
    { title: "Брусок строганный сухой", price: "35 р/пм", image: "image5.png" },
    {
        title: "Доска сухая строганная",
        price: "1370 р/шт",
        image: "image6.png",
    },
    {
        title: "Доска сухая строганная (сосна)",
        price: "140 р/шт",
        image: "image7.png",
    },
    { title: "Лист фанеры", price: "420 р/л", image: "image8.png" },
];

// жоска зарефакторил
const Main = () => {
    return (
        <Row gutter={[16, 16]} justify="center">
            {products.map((product, index) => (
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
                            maxWidth: "220px",
                            position: "relative",
                            transition: "transform 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            style={{
                                width: "100%",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "12px",
                            }}
                        />
                        <h3 style={{ fontSize: "14px", marginTop: "10px" }}>
                            {product.title}
                        </h3>
                        <div
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                background: "#e8f5e9",
                                borderRadius: "12px",
                                padding: "5px",
                                display: "inline-block",
                                marginTop: "5px",
                            }}
                        >
                            {product.price}
                        </div>
                        <IconButton
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                background: "#4caf50",
                                color: "white",
                                borderRadius: "50%",
                            }}
                        >
                            <ShoppingCartIcon fontSize="small" />
                        </IconButton>
                    </div>
                </Col>
            ))}
        </Row>
    );
};

export default Main;

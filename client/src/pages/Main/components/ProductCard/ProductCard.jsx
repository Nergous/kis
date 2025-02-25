import React from "react";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductCard = ({ product, addToCart }) => {
    const [price, measure] = product.price.split(/р?\//);

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
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
            }
        >
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
            <div style={{ 
                display: "flex", 
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 10px"
            }}>
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
                <IconButton
                    style={{
                        background: "#4caf50",
                        color: "white",
                        borderRadius: "50%",
                        padding: "8px",
                    }}
                    onClick={() => addToCart(product)}
                >
                    <ShoppingCartIcon fontSize="small" />
                </IconButton>
            </div>
        </div>
    );
};

export default ProductCard;
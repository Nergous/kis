import React, { useState, useEffect } from "react";
import { Row, Col, Skeleton } from "antd";
import { IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawer from "../components/CartDrawer/CartDrawer";
import ProductCard from "../components/ProductCard/ProductCard";
import ProductModal from "../components/ProductModal/ProductModal"; // Импортируем модальное окно
import api from "../../../utils/api";
import "antd/dist/reset.css";
import "../../../fonts.css";

const MainPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api().get("/api/products");
                setProducts(response.data);
                const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
                const cartItemsArray = Object.keys(storedCart).map((key) => ({
                    ...response.data.find((product) => product.ID === parseInt(key)),
                    quantity: storedCart[key],
                }));
                setCartItems(cartItemsArray);
                window.addEventListener("openCart", () => setIsCartOpen(true));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const saveCartToLocalStorage = (cart) => {
        const cartObject = cart.reduce((acc, item) => {
            acc[item.ID] = item.quantity;
            return acc;
        }, {});
        localStorage.setItem("cart", JSON.stringify(cartObject));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const addToCart = (product) => {
        const existing = cartItems.find((item) => item.ID === product.ID);
        let newCartItems;
        if (existing) {
            newCartItems = cartItems.map((item) => (item.ID === product.ID ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            newCartItems = [...cartItems, { ...product, quantity: 1 }];
        }
        setCartItems(newCartItems);
        saveCartToLocalStorage(newCartItems);
    };

    const removeFromCart = (productId) => {
        const newCartItems = cartItems.filter((item) => item.ID !== productId);
        setCartItems(newCartItems);
        saveCartToLocalStorage(newCartItems);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const newCartItems = cartItems.map((item) => (item.ID === productId ? { ...item, quantity: newQuantity } : item));
        setCartItems(newCartItems);
        saveCartToLocalStorage(newCartItems);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div style={{ position: "relative" }}>
            <IconButton
                style={{
                    position: "fixed",
                    right: 20,
                    top: 20,
                    zIndex: 1000,
                    background: "#4caf50",
                    color: "white",
                }}
                onClick={() => setIsCartOpen(true)}
            >
                <Badge
                    badgeContent={cartTotalItems}
                    color="error"
                    sx={{
                        "& .MuiBadge-badge": {
                            fontFamily: "'DMSans-Medium', sans-serif",
                        },
                    }}
                >
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            <Row gutter={[5, 100]} justify="center" style={{ paddingTop: 40 }}>
                {isLoading ? (
                    [...Array(12)].map((_, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={index} style={{ display: "flex", justifyContent: "center" }}>
                            <Skeleton 
                                active 
                                style={{
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    margin: "0 10px",
                                    padding: "15px",
                                    maxWidth: "300px",
                                    gap: "12px",
                                    borderRadius: "20px",
                                }} 
                            />
                        </Col>
                    ))
                ) : (
                    products.map((product, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={index} style={{ display: "flex", justifyContent: "center" }}>
                            <ProductCard 
                                product={product} 
                                addToCart={addToCart} 
                                onProductClick={handleProductClick} // Передаем функцию
                            />
                        </Col>
                    ))
                )}
            </Row>

            <CartDrawer
                isCartOpen={isCartOpen}
                closeCart={() => setIsCartOpen(false)}
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
            />

            <ProductModal
                product={selectedProduct}
                visible={isModalVisible}
                onClose={handleCloseModal}
                addToCart={addToCart}
            />
        </div>
    );
};

export default MainPage;
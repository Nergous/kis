import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawer from "../components/CartDrawer/CartDrawer";
import ProductCard from "../components/ProductCard/ProductCard";
import "antd/dist/reset.css";
import "../../../fonts.css";

const products = [
    { id: 1, title: "Брус клеёный", price: "1.110₽ /шт", image: "image1.png" },
    { id: 2, title: "Доска обрезная хвойных пород", price: "10.050₽ /м3", image: "image2.png" },
    { id: 3, title: "Рейка деревянная", price: "17₽ /пм", image: "image3.png" },
    { id: 4, title: "Брус с ленточным распилом", price: "20.500₽ /м3", image: "image4.png" },
    { id: 5, title: "Брусок строганный сухой", price: "35₽ /пм", image: "image5.png" },
    { id: 6, title: "Доска сухая строганная", price: "1.370₽ /шт", image: "image6.png" },
    { id: 7, title: "Доска сухая строганная (сосна)", price: "140₽ /шт", image: "image7.png" },
    { id: 8, title: "Лист фанеры", price: "420₽ /л", image: "image8.png" },
];

const MainPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
        const cartItemsArray = Object.keys(storedCart).map(key => ({
            ...products.find(product => product.id === parseInt(key)),
            quantity: storedCart[key]
        }));
        setCartItems(cartItemsArray);
        window.addEventListener("openCart", () => setIsCartOpen(true));
    }, []);

    const clearCart = () => {
        setCartItems([]); // Очищаем корзину
        localStorage.removeItem("cart"); // Очищаем localStorage
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const saveCartToLocalStorage = (cart) => {
        const cartObject = cart.reduce((acc, item) => {
            acc[item.id] = item.quantity;
            return acc;
        }, {});
        localStorage.setItem("cart", JSON.stringify(cartObject));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const addToCart = (product) => {
        const existing = cartItems.find(item => item.id === product.id);
        let newCartItems;
        if (existing) {
            newCartItems = cartItems.map(item =>
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            );
        } else {
            newCartItems = [...cartItems, { ...product, quantity: 1 }];
        }
        setCartItems(newCartItems);
        saveCartToLocalStorage(newCartItems);
        setIsCartOpen(true);
    };

    const removeFromCart = (productId) => {
        const newCartItems = cartItems.filter(item => item.id !== productId);
        setCartItems(newCartItems);
        saveCartToLocalStorage(newCartItems);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const newCartItems = cartItems.map(item =>
            item.id === productId 
                ? { ...item, quantity: newQuantity } 
                : item
        );
        setCartItems(newCartItems);
        saveCartToLocalStorage(newCartItems);
    };

    const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div style={{ position: 'relative' }}>
            <IconButton
                style={{
                    position: 'fixed',
                    right: 20,
                    top: 20,
                    zIndex: 1000,
                    background: '#4caf50',
                    color: 'white'
                }}
                onClick={() => setIsCartOpen(true)}
            >
                <Badge 
                    badgeContent={cartTotalItems} 
                    color="error"
                    sx={{ 
                        '& .MuiBadge-badge': {
                            fontFamily: "'DMSans-Medium', sans-serif"
                        } 
                    }}
                >
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            <Row gutter={[5, 100]} justify="center" style={{ paddingTop: 40 }}>
                {products.map((product, index) => (
                    <Col
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        key={index}
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <ProductCard product={product} addToCart={addToCart} />
                    </Col>
                ))}
            </Row>

            <CartDrawer 
                isCartOpen={isCartOpen} 
                closeCart={() => setIsCartOpen(false)} 
                cartItems={cartItems} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart}
                clearCart={clearCart}
            />
        </div>
    );
};

export default MainPage;
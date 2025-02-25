import React, { useState, createContext, useContext } from "react";
import { Row, Col } from "antd";
import { IconButton, Badge, Drawer, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import "antd/dist/reset.css";
import "../../../fonts.css";

const CartContext = createContext();

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

const CartDrawer = () => {
    const { cartItems, removeFromCart, updateQuantity, isCartOpen, closeCart } = useContext(CartContext);
    
    return (
        <Drawer
            anchor="right"
            open={isCartOpen}
            onClose={closeCart}
            sx={{ 
                '& .MuiDrawer-paper': { 
                    width: 350,
                    padding: "20px",
                } 
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <h2 style={{ fontFamily: "'DMSans-Medium', sans-serif", color: "#085615" }}>Корзина</h2>
                <IconButton onClick={closeCart}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {cartItems.length === 0 ? (
                <p style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>Корзина пуста</p>
            ) : (
                cartItems.map((item) => (
                    <Box 
                        key={item.id} 
                        sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            mb: 2,
                            p: 1,
                            borderRadius: 2,
                            boxShadow: 1,
                            alignItems: 'center',
                            backgroundColor: "#f5f5f5"
                        }}
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            style={{ 
                                width: 50, 
                                height: 50, 
                                objectFit: 'cover', 
                                borderRadius: 6 
                            }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <div style={{ 
                                fontWeight: 'bold', 
                                fontSize: 14,
                                fontFamily: "'DMSans-Medium', sans-serif",
                                color: "#085615"
                            }}>
                                {item.title}
                            </div>
                            <div style={{ 
                                fontSize: 12, 
                                color: '#666',
                                fontFamily: "'DMSans-Regular', sans-serif"
                            }}>
                                {item.price}
                            </div>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1, 
                                mt: 1 
                            }}>
                                <IconButton 
                                    size="small" 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity === 1}
                                    sx={{ color: "#085615" }}
                                >
                                    <RemoveIcon fontSize="small" />
                                </IconButton>
                                <span style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>
                                    {item.quantity}
                                </span>
                                <IconButton 
                                    size="small" 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    sx={{ color: "#085615" }}
                                >
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                        <IconButton 
                            onClick={() => removeFromCart(item.id)}
                            sx={{ color: "#ff4444" }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ))
            )}
        </Drawer>
    );
};

const MainPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => 
            prev.map(item =>
                item.id === productId 
                    ? { ...item, quantity: newQuantity } 
                    : item
            )
        );
    };

    const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider 
            value={{ 
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                isCartOpen,
                openCart: () => setIsCartOpen(true),
                closeCart: () => setIsCartOpen(false)
            }}
        >
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

                <Row gutter={[5, 100]} justify="center" style={{ paddingTop: 70 }}>
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
                            </Col>
                        );
                    })}
                </Row>

                <CartDrawer />
            </div>
        </CartContext.Provider>
    );
};

export default MainPage;
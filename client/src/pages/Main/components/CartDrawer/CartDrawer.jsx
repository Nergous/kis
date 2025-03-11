import React, { useState } from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import { Add, Remove, Close } from "@mui/icons-material";
import { Button } from "antd";
import OrderModal from "../OrderModal/OrderModal";
import api from "../../../../utils/api";

const CartDrawer = ({ isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, clearCart }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleImagePath = (imgPath) => imgPath.replace(/\\/g, "/").split("public")[1];

    const handleOrderSubmit = async (orderData) => {
        try {
            await api().post("/api/orders", orderData);
        } catch (error) {
            console.error("Error submitting order:", error);
        }
        setIsModalVisible(false);
        clearCart();
        closeCart();
    };

    const handleOpenOrderModal = () => {
        closeCart(); // Закрываем корзину
        setIsModalVisible(true); // Открываем модальное окно
    };

    return (
        <>
            <Drawer
                anchor="right"
                open={isCartOpen}
                onClose={closeCart}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 350,
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    },
                }}>
                <div>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                        }}>
                        <h2
                            style={{
                                fontFamily: "'DMSans-Medium', sans-serif",
                                color: "#085615",
                            }}>
                            Корзина
                        </h2>
                        <IconButton onClick={closeCart}>
                            <Close />
                        </IconButton>
                    </Box>

                    <Button variant="contained" style={{ marginBottom: 15 }} onClick={clearCart} disabled={cartItems.length === 0}>
                        Очистить корзину
                    </Button>

                    {cartItems.length === 0 ? (
                        <p style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>Корзина пуста</p>
                    ) : (
                        cartItems.map((item) => (
                            <Box
                                key={item.ID}
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mb: 2,
                                    p: 1,
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    alignItems: "center",
                                    backgroundColor: "#f5f5f5",
                                }}>
                                <img
                                    src={handleImagePath(item.img_path)}
                                    alt={item.name}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        objectFit: "cover",
                                        borderRadius: 6,
                                    }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 14,
                                            fontFamily: "'DMSans-Medium', sans-serif",
                                            color: "#085615",
                                        }}>
                                        {item.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "#666",
                                            fontFamily: "'DMSans-Regular', sans-serif",
                                        }}>
                                        {item.price} ₽
                                    </div>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mt: 1,
                                        }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => updateQuantity(item.ID, item.quantity - 1)}
                                            disabled={item.quantity === 1}
                                            sx={{ color: "#085615" }}>
                                            <Remove fontSize="small" />
                                        </IconButton>
                                        <span style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>{item.quantity}</span>
                                        <IconButton size="small" onClick={() => updateQuantity(item.ID, item.quantity + 1)} sx={{ color: "#085615" }}>
                                            <Add fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <IconButton onClick={() => removeFromCart(item.ID)} sx={{ color: "#ff4444" }}>
                                    <Close fontSize="small" />
                                </IconButton>
                            </Box>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <Box
                        sx={{
                            mt: 3,
                            pt: 2,
                            borderTop: "1px solid #e0e0e0",
                            backgroundColor: "white",
                            position: "sticky",
                            bottom: 0,
                        }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 3,
                                fontFamily: "'DMSans-Medium', sans-serif",
                                fontSize: "1.1rem",
                            }}>
                            <span>Итого:</span>
                            <span>{totalAmount.toLocaleString("ru-RU")} ₽</span>
                        </Box>

                        <Button
                            type="primary"
                            block
                            size="large"
                            style={{
                                backgroundColor: "#085615",
                                height: "45px",
                                borderRadius: "10px",
                                fontFamily: "'DMSans-Medium', sans-serif",
                                fontSize: "1rem",
                                color: "white",
                            }}
                            onClick={handleOpenOrderModal}>
                            Оформить заказ
                        </Button>
                    </Box>
                )}
            </Drawer>

            <OrderModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleOrderSubmit}
                cartItems={cartItems}
                totalAmount={totalAmount}
            />
        </>
    );
};

export default CartDrawer;

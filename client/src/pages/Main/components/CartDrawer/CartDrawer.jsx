import React from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "antd";

const CartDrawer = ({ isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, clearCart }) => {
    const imgSlashChange = (img_path) => {
        img_path = img_path.replace(/\\/g, "/").split("public")[1];
        return img_path;
    };

    // Рассчитываем общую сумму
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Drawer
            anchor="right"
            open={isCartOpen}
            onClose={closeCart}
            sx={{ 
                '& .MuiDrawer-paper': { 
                    width: 350,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                } 
            }}
        >
            <div>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <h2 style={{ fontFamily: "'DMSans-Medium', sans-serif", color: "#085615" }}>Корзина</h2>
                    <IconButton onClick={closeCart}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                <Button
                    variant="contained"
                    style={{ marginBottom: 15 }}
                    onClick={clearCart}
                    disabled={cartItems.length === 0}
                >
                    Очистить корзину
                </Button>

                {cartItems.length === 0 ? (
                    <p style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>Корзина пуста</p>
                ) : (
                    cartItems.map((item) => (
                        <Box 
                            key={item.ID} 
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
                                src={imgSlashChange(item.img_path)}
                                alt={item.name}
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
                                    {item.name}
                                </div>
                                <div style={{ 
                                    fontSize: 12, 
                                    color: '#666',
                                    fontFamily: "'DMSans-Regular', sans-serif"
                                }}>
                                    {item.price} ₽
                                </div>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1, 
                                    mt: 1 
                                }}>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => updateQuantity(item.ID, item.quantity - 1)}
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
                                        onClick={() => updateQuantity(item.ID, item.quantity + 1)}
                                        sx={{ color: "#085615" }}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                            <IconButton 
                                onClick={() => removeFromCart(item.ID)}
                                sx={{ color: "#ff4444" }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))
                )}
            </div>

            {/* Блок с общей суммой и кнопкой оформления */}
            {cartItems.length > 0 && (
                <Box sx={{ 
                    mt: 3, 
                    pt: 2, 
                    borderTop: "1px solid #e0e0e0",
                    backgroundColor: "white",
                    position: "sticky",
                    bottom: 0
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mb: 3,
                        fontFamily: "'DMSans-Medium', sans-serif",
                        fontSize: "1.1rem"
                    }}>
                        <span>Итого:</span>
                        <span>{totalAmount.toLocaleString('ru-RU')} ₽</span>
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
                            color: "white"
                        }}
                        onClick={() => alert("Заказ оформлен! Спасибо!")}
                    >
                        Оформить заказ
                    </Button>
                </Box>
            )}
        </Drawer>
    );
};

export default CartDrawer;
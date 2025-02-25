import React from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "antd";

const CartDrawer = ({ isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, clearCart }) => {
    
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

export default CartDrawer;
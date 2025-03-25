import React, { useState, useEffect } from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import { Add, Remove, Close } from "@mui/icons-material";
import { Button } from "antd";
import OrderModal from "../OrderModal/OrderModal";
import api from "../../../../utils/api";
import { showErrorNotification } from "../../../../ui/Notification/Notification";
import { showSuccessNotification } from "../../../../ui/Notification/Notification";

const CartDrawer = ({ 
    isCartOpen, 
    closeCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
}) => {
    // Состояния для управления модальным окном иролью
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // Расчет общей суммы товаров в корзине
    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
    );

    // Эффект для проверки роли пользователя при монтировании компонента
    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
    }, []);

    // Преобразование пути изображения
    const handleImagePath = (imgPath) => {
        if (!imgPath) return "/placeholder-image.jpg";
        return imgPath.replace(/\\/g, "/").split("public")[1];
    }

    // ОбработкаSubmit заказа
    const handleOrderSubmit = async (orderData) => {
        try {
            await api().post("/api/orders", orderData);
            setIsModalVisible(false);
            showSuccessNotification("Заказ успешно оформлен");
            clearCart();
            closeCart();
            localStorage.removeItem("cart");
        } catch (error) {
            showErrorNotification("Произошла ошибка " + error.response.data.error);
            console.error("Ошибка при оформлении заказа:", error);
        }
    };

    // Открытие модального окна заказа
    const handleOpenOrderModal = () => {
        if (userRole) {
            closeCart(); 
            setIsModalVisible(true);
        }
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
                }}
            >
                <div>
                    {/* Заголовок корзины */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                        }}
                    >
                        <h2
                            style={{
                                fontFamily: "'DMSans-Medium', sans-serif",
                                color: "#085615",
                            }}
                        >
                            Корзина
                        </h2>
                        <IconButton onClick={closeCart}>
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Кнопка очистки корзины */}
                    <Button 
                        variant="contained" 
                        style={{ marginBottom: 15 }} 
                        onClick={clearCart} 
                        disabled={cartItems.length === 0}
                    >
                        Очистить корзину
                    </Button>

                    {/* Список товаров в корзине */}
                    {cartItems.length === 0 ? (
                        <p style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
                            Корзина пуста
                        </p>
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
                                }}
                            >
                                {/* Изображение товара */}
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

                                {/* Информация о товаре */}
                                <Box sx={{ flexGrow: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 14,
                                            fontFamily: "'DMSans-Medium', sans-serif",
                                            color: "#085615",
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "#666",
                                            fontFamily: "'DMSans-Regular', sans-serif",
                                        }}
                                    >
                                        {item.price} ₽
                                    </div>

                                    {/* Управление количеством */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mt: 1,
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => updateQuantity(item.ID, item.quantity - 1)}
                                            disabled={item.quantity === 1}
                                            sx={{ color: "#085615" }}
                                        >
                                            <Remove fontSize="small" />
                                        </IconButton>
                                        <span style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>
                                            {item.quantity}
                                        </span>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => updateQuantity(item.ID, item.quantity + 1)} 
                                            sx={{ color: "#085615" }}
                                        >
                                            <Add fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Удаление товара */}
                                <IconButton 
                                    onClick={() => removeFromCart(item.ID)} 
                                    sx={{ color: "#ff4444" }}
                                >
                                    <Close fontSize="small" />
                                </IconButton>
                            </Box>
                        ))
                    )}
                </div>

                {/* Подвал корзины с итоговой суммой и кнопкой заказа */}
                {cartItems.length > 0 && (
                    <Box
                        sx={{
                            mt: 3,
                            pt: 2,
                            borderTop: "1px solid #e0e0e0",
                            backgroundColor: "white",
                            position: "sticky",
                            bottom: 0,
                        }}
                    >
                        {/* Итоговая сумма */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 3,
                                fontFamily: "'DMSans-Medium', sans-serif",
                                fontSize: "1.1rem",
                            }}
                        >
                            <span>Итого:</span>
                            <span>{totalAmount.toLocaleString("ru-RU")} ₽</span>
                        </Box>

                        {/* Сообщение для незарегистрированных пользователей */}
                        {!userRole && (
                            <Box 
                                sx={{ 
                                    textAlign: 'center', 
                                    color: '#ff4444', 
                                    mb: 2,
                                    fontFamily: "'DMSans-Regular', sans-serif"
                                }}
                            >
                                Для оформления заказа необходимо создать личный кабинет
                            </Box>
                        )}

                        {/* Кнопка оформления заказа */}
                        <Button
                            type="primary"
                            block
                            size="large"
                            disabled={!userRole}
                            style={{
                                backgroundColor: userRole ? "#085615" : "#cccccc",
                                height: "45px",
                                borderRadius: "10px",
                                fontFamily: "'DMSans-Medium', sans-serif",
                                fontSize: "1rem",
                                color: "white",
                                cursor: userRole ? 'pointer' : 'not-allowed'
                            }}
                            onClick={handleOpenOrderModal}
                        >
                            Оформить заказ
                        </Button>
                    </Box>
                )}
            </Drawer>

            {/* Модальное окно оформления заказа */}
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
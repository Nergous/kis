import React from "react";
import logo_2 from "../../../logo_2.png";

const RegLogLayout = ({ children }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "rgb(76, 175, 80)",
            }}
        >
            {/* Карточка с формой */}
            <div
                style={{
                    position: "relative", // Относительное позиционирование для карточки
                }}
            >
                {/* Логотип */}
                <img
                    src={logo_2}
                    alt="logo"
                    style={{
                        width: 350, // Размер логотипа
                        position: "absolute", // Абсолютное позиционирование относительно карточки
                        top: "-80px", // Сдвиг логотипа вверх
                        left: "50%", // Центрирование по горизонтали
                        transform: "translateX(-50%)", // Точное центрирование
                    }}
                />
                {children}
            </div>
        </div>
    );
};

export default RegLogLayout;

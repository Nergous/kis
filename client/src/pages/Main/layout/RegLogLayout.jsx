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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative", // Относительное позиционирование для карточки
                }}
            >
                {/* Логотип */}
                <img
                    src={logo_2}
                    alt="logo"
                    style={{
                        width: 350, // Размер логотипа
                        transition: "transform 0.4s ease-in-out",
                        marginBottom: "5px",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    onClick={() => {
                        window.location.href = "/";
                    }}
                />
                {children}
            </div>
        </div>
    );
};

export default RegLogLayout;

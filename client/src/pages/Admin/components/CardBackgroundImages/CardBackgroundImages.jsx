import React from "react";
import { Card } from "antd";

const CardBackgroundImages = ({ children, width }) => {
    return (
        <Card
            style={{
                backgroundColor: "rgba(51, 51, 51, 0.1)", // Серый фон
                padding: "8px",
                borderRadius: "16px",
                boxShadow: "2px 0 12px rgba(51, 51, 51, 0.1)",
                width: width,
            }}
        >
            {children}
        </Card>
    );
};

export default CardBackgroundImages;

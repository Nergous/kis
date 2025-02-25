import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ButtonBack = ({ navigateTo, type="primary" }) => {
    const navigate = useNavigate();
    return (
        <Button
            type={type}
            ghost
            style={{ marginBottom: 16 }}
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(navigateTo)}
        >
            Назад
        </Button>
    );
};

export default ButtonBack;

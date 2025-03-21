import React from "react";

import { Card } from "antd"

import CountUp from "../../../../components/CountUp/CountUp";

const CardStats = ({ title, value, icon, backgroundColor, borderColor, iconColor }) => {
    return (
        <Card
            style={{
                backgroundColor: backgroundColor,
                borderRadius: "10px",
                textAlign: "center",
                borderColor: borderColor,
            }}
        >
            {React.cloneElement(icon, { style: { fontSize: "24px", color: iconColor } })}
            <h3 style={{ margin: "10px 0" }}>{title}</h3>
            <div style={{ fontSize: "24px" }}>
                <CountUp from={0} to={value} separator="," direction="up" duration={1} className="count-up-text" />
            </div>
        </Card>
    );
};

export default CardStats;
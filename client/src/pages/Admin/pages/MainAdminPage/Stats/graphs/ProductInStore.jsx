import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 3px 4px rgba(0, 0, 0, 0.1)",
                }}>
                <p style={{ margin: 0 }}>Название: {label}</p>
                <p style={{ margin: 0 }}>Количество: {payload[0].value} куб.м</p>
            </div>
        );
    }

    return null;
};

const ProductInStore = ({ barData }) => {
    
    return (
        <div
            style={{
                marginTop: "40px",
                backgroundColor: "rgba(226, 226, 226, 0.6)",
                padding: "20px",
                borderRadius: "8px",
                width: "80%",
            }}
        >
            <h3>Количество товаров на складе</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={barData}
                    margin={{
                        top: 20,
                        right: 10,
                        bottom: 50,
                        left: 25,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0, 0, 0, 0.2)"
                    />
                    <XAxis
                        dataKey="name"
                        name="Название товара"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        tick={{ fill: "#333", fontSize: 14 }}
                        axisLine={{ stroke: "#666" }}
                    />
                    <YAxis
                        name="Количество"
                        unit=" куб.м"
                        tick={{ fill: "#333", fontSize: 14 }}
                        axisLine={{ stroke: "#666" }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    />
                    <Legend
                        wrapperStyle={{
                            paddingTop: "0px",
                            paddingBottom: "10px",
                        }}
                        layout="horizontal"
                        align="center"
                        verticalAlign="top"
                    />
                    <Bar
                        dataKey="quantity"
                        name="Количество товаров"
                        fill="rgb(24, 144, 255)"
                        animationDuration={1000}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProductInStore;

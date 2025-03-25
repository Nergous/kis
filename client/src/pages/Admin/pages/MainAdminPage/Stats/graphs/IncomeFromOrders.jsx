import React, { useState, useEffect } from "react";
import { Card, Select, Spin, message } from "antd";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Dot,
} from "recharts";
import api from "../../../../../../utils/api";

const { Option } = Select;

const durationOptions = [
    { value: "week", label: "Неделя" },
    { value: "month", label: "Месяц" },
    { value: "3month", label: "3 месяца" },
    { value: "6month", label: "6 месяцев" },
    { value: "year", label: "Год" },
    { value: "all", label: "Все время" },
];

const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${day}.${month}.${year}`;
};

const formatTooltipDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${day}.${month}.${year}`;
};

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
                }}
            >
                <p style={{ margin: 0, fontWeight: 500 }}>
                    Дата: {formatTooltipDate(label)}
                </p>
                <p style={{ margin: 0, color: "#1890ff" }}>
                    Доход:{" "}
                    <span style={{ fontWeight: 500 }}>
                        {payload[0].value} ₽
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

// Кастомный элемент точки для графика
const CustomDot = (props) => {
    const { cx, cy, stroke } = props;
    return (
        <Dot
            cx={cx}
            cy={cy}
            r={5}
            stroke={stroke}
            strokeWidth={2}
            fill="#fff"
        />
    );
};

const IncomeFromOrders = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [duration, setDuration] = useState("week"); // По умолчанию неделя

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api().get("/api/payments", {
                    params: { duration },
                });

                const formattedData = response.data.money.map((item) => ({
                    date: item.date,
                    sum: parseFloat(item.sum),
                }));

                setData(formattedData);
            } catch (error) {
                message.error("Ошибка загрузки данных о доходах");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [duration]);

    return (
        <Card
            title="График доходов"
            style={{
                marginTop: "40px",
                backgroundColor: "rgba(226, 226, 226, 0.6)",
                padding: "20px",
                borderRadius: "8px",
                width: "80%",
            }}
            extra={
                <Select
                    value={duration}
                    onChange={setDuration}
                    style={{ width: 150 }}
                    loading={loading}
                >
                    {durationOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            }
        >
            <Spin spinning={loading}>
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(0, 0, 0, 0.2)"
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fill: "#333", fontSize: 14 }}
                                axisLine={{ stroke: "#666" }}
                            />
                            <YAxis
                                tick={{ fill: "#333", fontSize: 14 }}
                                axisLine={{ stroke: "#666" }}
                                tickFormatter={(value) => `${value} ₽`}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                            />
                            <Area
                                type="linear" // Убираем сглаживание
                                dataKey="sum"
                                stroke="#1890ff"
                                fill="#1890ff"
                                fillOpacity={0.2}
                                dot={<CustomDot />} // Добавляем точки
                                activeDot={{ r: 6, strokeWidth: 2 }}
                                connectNulls={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ textAlign: "center", padding: 24 }}>
                        {!loading && "Нет данных для отображения"}
                    </div>
                )}
            </Spin>
        </Card>
    );
};

export default IncomeFromOrders;

import React, { useLayoutEffect, useState } from "react";
import { Col, Row } from "antd";
import { ShoppingOutlined, RocketOutlined, CarOutlined, CheckCircleOutlined } from "@ant-design/icons"; // Импорт иконок
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Импорт компонентов для гистограммы

import api from "../../../../../../utils/api";
import showErrorNotification from "../../../../../../ui/Notification/Notification";
import CardStats from "../../../../components/CardStats/CardStats";

const DirectorStats = () => {
    const [inAssembly, setInAssembly] = useState(0); // Инициализация числом
    const [awaitingShipment, setAwaitingShipment] = useState(0); // Инициализация числом
    const [inTransit, setInTransit] = useState(0); // Инициализация числом
    const [received, setReceived] = useState(0); // Инициализация числом
    const [productsItemsCount, setProductsItemsCount] = useState([]); // Инициализация пустым массивом

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const [inAssemblyRes, awaitingShipmentRes, inTransitRes, receivedRes, productsItemsRes] = await Promise.all([
                    api().get("/api/order-by-status", { params: { status: "in_assembly" } }),
                    api().get("/api/order-by-status", { params: { status: "awaiting_shipment" } }),
                    api().get("/api/order-by-status", { params: { status: "in_transit" } }),
                    api().get("/api/order-by-status", { params: { status: "received" } }),
                    api().get("/api/products-count"),
                ]);

                setInAssembly(inAssemblyRes.data.count); // Убедитесь, что значение является числом
                setAwaitingShipment(awaitingShipmentRes.data.count); // Убедитесь, что значение является числом
                setInTransit(inTransitRes.data.count); // Убедитесь, что значение является числом
                setReceived(receivedRes.data.count); // Убедитесь, что значение является числом
                setProductsItemsCount(productsItemsRes.data.count); // Убедитесь, что передается массив
            } catch (err) {
                showErrorNotification("Error fetching data");
            }
        };

        fetchData();
    }, []);

    // Преобразуем данные для гистограммы
    const barData = productsItemsCount.map((item) => ({
        name: item.Name,
        quantity: item.Quantity,
    }));

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

    return (
        <div>
            <h1>Статистика директора</h1>
            <Row gutter={20}>
                <Col span={6}>
                    <CardStats
                        title="В сборке"
                        value={inAssembly}
                        icon={<ShoppingOutlined />}
                        backgroundColor="#f0f5ff"
                        borderColor="#1890ff"
                        iconColor="#1890ff"
                    />
                </Col>
                <Col span={6}>
                    <CardStats
                        title="Ожидает отправки"
                        value={awaitingShipment}
                        icon={<RocketOutlined />}
                        backgroundColor="#fff7e6"
                        borderColor="#faad14"
                        iconColor="#faad14"
                    />
                </Col>
                <Col span={6}>
                    <CardStats
                        title="В пути"
                        value={inTransit}
                        icon={<CarOutlined />}
                        backgroundColor="#e6fffb"
                        borderColor="#13c2c2"
                        iconColor="#13c2c2"
                    />
                </Col>
                <Col span={6}>
                    <CardStats
                        title="Получено"
                        value={received}
                        icon={<CheckCircleOutlined />}
                        backgroundColor="#f6ffed"
                        borderColor="#52c41a"
                        iconColor="#52c41a"
                    />
                </Col>
            </Row>

            {/* Гистограмма */}
            {productsItemsCount && (
                <div style={{ marginTop: "40px", backgroundColor: "rgba(226, 226, 226, 0.6)", padding: "20px", borderRadius: "8px", width: "80%" }}>
                    <h3>Количество товаров на складе</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={barData}
                            margin={{
                                top: 20,
                                right: 10,
                                bottom: 50, // Увеличил отступ снизу для длинных названий
                                left: 25,
                            }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.2)" />
                            <XAxis
                                dataKey="name"
                                name="Название товара"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                tick={{ fill: "#333", fontSize: 14 }}
                                axisLine={{ stroke: "#666" }}
                            />
                            <YAxis name="Количество" unit=" куб.м" tick={{ fill: "#333", fontSize: 14 }} axisLine={{ stroke: "#666" }} />
                            <Tooltip
                                content={<CustomTooltip />} // Используем кастомный Tooltip
                                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                            />
                            <Legend
                                wrapperStyle={{
                                    paddingTop: "0px", // Отступ сверху для легенды
                                    paddingBottom: "10px",
                                }}
                                layout="horizontal" // Располагаем легенду горизонтально
                                align="center" // Выравниваем по центру
                                verticalAlign="top" // Размещаем легенду сверху
                            />
                            <Bar
                                dataKey="quantity"
                                name="Количество товаров"
                                fill="rgb(24, 144, 255)"
                                animationDuration={1000} // Анимация появления столбцов
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default DirectorStats;

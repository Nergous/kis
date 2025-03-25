import React, { useLayoutEffect, useState } from "react";
import { Col, Row, Skeleton, Typography } from "antd";
import {
    ShoppingOutlined,
    RocketOutlined,
    CarOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

import ProductInStore from "../graphs/ProductInStore";

import api from "../../../../../../utils/api";
import showErrorNotification from "../../../../../../ui/Notification/Notification";
import CardStats from "../../../../components/CardStats/CardStats";
import IncomeFromOrders from "../graphs/IncomeFromOrders";

const { Text } = Typography;

const DirectorStats = () => {
    const [inAssembly, setInAssembly] = useState(null);
    const [awaitingShipment, setAwaitingShipment] = useState(null);
    const [inTransit, setInTransit] = useState(null);
    const [received, setReceived] = useState(null);
    const [productsItemsCount, setProductsItemsCount] = useState(null);

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    inAssemblyRes,
                    awaitingShipmentRes,
                    inTransitRes,
                    receivedRes,
                    productsItemsRes,
                ] = await Promise.all([
                    api().get("/api/order-by-status", {
                        params: { status: "in_assembly" },
                    }),
                    api().get("/api/order-by-status", {
                        params: { status: "awaiting_shipment" },
                    }),
                    api().get("/api/order-by-status", {
                        params: { status: "in_transit" },
                    }),
                    api().get("/api/order-by-status", {
                        params: { status: "received" },
                    }),
                    api().get("/api/products-count"),
                ]);

                setInAssembly(inAssemblyRes.data?.count ?? 0);
                setAwaitingShipment(awaitingShipmentRes.data?.count ?? 0);
                setInTransit(inTransitRes.data?.count ?? 0);
                setReceived(receivedRes.data?.count ?? 0);
                setProductsItemsCount(productsItemsRes.data?.count ?? []);
            } catch (err) {
                showErrorNotification("Error fetching data");
                setInAssembly(0);
                setAwaitingShipment(0);
                setInTransit(0);
                setReceived(0);
                setProductsItemsCount([]);
            }
        };

        fetchData();
    }, []);

    // Преобразуем данные для гистограммы
    const barData = (productsItemsCount || []).map((item) => ({
        name: item.Name,
        quantity: item.Quantity,
    }));

    // Проверяем, загрузились ли основные данные
    const mainStatsLoaded =
        inAssembly !== null &&
        awaitingShipment !== null &&
        inTransit !== null &&
        received !== null;

    return (
        <div>
            <h1>Статистика директора</h1>

            {!mainStatsLoaded ? (
                <Skeleton active />
            ) : (
                <>
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

                    {/* Гистограмма - показываем только если есть данные */}
                    {productsItemsCount && productsItemsCount.length > 0 ? (
                        <ProductInStore barData={barData} />
                    ) : (
                        <div style={{ textAlign: "center", padding: "24px" }}>
                            <Text type="secondary">Нет данных о продуктах</Text>
                        </div>
                    )}
                    <IncomeFromOrders />
                </>
            )}
        </div>
    );
};

export default DirectorStats;

import React, { useLayoutEffect, useState } from "react";
import { Col, Row, Skeleton, Typography } from "antd";
import {
    FieldTimeOutlined,
    CreditCardOutlined,
    ToolOutlined,
    InboxOutlined,
    TruckOutlined,
    CheckCircleOutlined,
    MobileOutlined
  } from '@ant-design/icons';

import ProductInStore from "../graphs/ProductInStore";

import api from "../../../../../../utils/api";
import showErrorNotification from "../../../../../../ui/Notification/Notification";
import CardStats from "../../../../components/CardStats/CardStats";

const { Text } = Typography;

const ManagerStorageStats = () => {
    const [inProcessing, setInProcessing] = useState(null);
    const [awaitingPayment, setAwaitingPayment] = useState(null);
    const [inAssembly, setInAssembly] = useState(null);
    const [awaitingShipment, setAwaitingShipment] = useState(null);
    const [inTransit, setInTransit] = useState(null);
    const [received, setReceived] = useState(null);
    const [contacting, setContacting] = useState(null);
    const [productsItemsCount, setProductsItemsCount] = useState(null);

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    inProcessingRes,
                    AwaitingPaymentRes,
                    inAssemblyRes,
                    awaitingShipmentRes,
                    inTransitRes,
                    receivedRes,
                    contactingRes,
                    productsItemsRes,
                ] = await Promise.all([
                    api().get("/api/order-by-status", {
                        params: { status: "in_processing" },
                    }),
                    api().get("/api/order-by-status", {
                        params: { status: "awaiting_payment" },
                    }),
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
                    api().get("/api/order-by-status", {
                        params: { status: "contacting" },
                    }),
                    api().get("/api/products-count"),
                ]);

                setInProcessing(inProcessingRes.data?.count ?? 0);
                setAwaitingPayment(AwaitingPaymentRes.data?.count ?? 0);
                setInAssembly(inAssemblyRes.data?.count ?? 0);
                setAwaitingShipment(awaitingShipmentRes.data?.count ?? 0);
                setInTransit(inTransitRes.data?.count ?? 0);
                setReceived(receivedRes.data?.count ?? 0);
                setContacting(contactingRes.data?.count ?? 0);
                setProductsItemsCount(productsItemsRes.data?.count ?? []);
            } catch (err) {
                showErrorNotification("Error fetching data");
                setInProcessing(0);
                setAwaitingPayment(0);
                setInAssembly(0);
                setAwaitingShipment(0);
                setInTransit(0);
                setReceived(0);
                setContacting(0);
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
        inProcessing !== null &&
        awaitingPayment !== null &&
        inAssembly !== null &&
        awaitingShipment !== null &&
        inTransit !== null &&
        received !== null &&
        contacting !== null;

    return (
        <div>
            <h1>Главная страница</h1>

            {!mainStatsLoaded ? (
                <Skeleton active />
            ) : (
                <>
                    <Row gutter={20}>
                        <Col span={6}>
                            <CardStats
                                title="В обработке"
                                value={inProcessing}
                                icon={<FieldTimeOutlined />}
                                backgroundColor="#f0f5ff"
                                borderColor="#1890ff"
                                iconColor="#1890ff"
                            />
                        </Col>
                        <Col span={6}>
                            <CardStats
                                title="Ожидает оплаты"
                                value={awaitingPayment}
                                icon={<CreditCardOutlined />}
                                backgroundColor="#fff0f6"
                                borderColor="#eb2f96"
                                iconColor="#eb2f96"
                            />
                        </Col>
                        <Col span={6}>
                            <CardStats
                                title="В сборке"
                                value={inAssembly}
                                icon={<ToolOutlined />}
                                backgroundColor="#fff7e6"
                                borderColor="#fa8c16"
                                iconColor="#fa8c16"
                            />
                        </Col>
                        <Col span={6}>
                            <CardStats
                                title="Ожидает отправки"
                                value={awaitingShipment}
                                icon={<InboxOutlined />}
                                backgroundColor="#fff2e8"
                                borderColor="#fa541c"
                                iconColor="#fa541c"
                            />
                        </Col>
                        <Col span={6}>
                            <CardStats
                                title="В пути"
                                value={inTransit}
                                icon={<TruckOutlined />}
                                backgroundColor="#e6f7ff"
                                borderColor="#08979c"
                                iconColor="#08979c"
                            />
                        </Col>
                        <Col span={6}>
                            <CardStats
                                title="Получено"
                                value={received}
                                icon={<CheckCircleOutlined />}
                                backgroundColor="#f6ffed"
                                borderColor="#389e0d"
                                iconColor="#389e0d"
                            />
                        </Col>
                        <Col span={6}>
                            <CardStats
                                title="Связь с клиентом"
                                value={contacting}
                                icon={<MobileOutlined />}
                                backgroundColor="#f9f0ff"
                                borderColor="#722ed1"
                                iconColor="#722ed1"
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
                </>
            )}
        </div>
    );
};

export default ManagerStorageStats;

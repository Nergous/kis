import React, { useLayoutEffect, useState } from "react";
import { Col, Row, Skeleton, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import api from "../../../../../../utils/api";
import showErrorNotification from "../../../../../../ui/Notification/Notification";
import CardStats from "../../../../components/CardStats/CardStats";
import { CONTRACTS } from "../../../../../../constants/contracts";
import IncomeFromOrders from "../graphs/IncomeFromOrders";

const { Text } = Typography;

const AccountantStats = () => {
    const [contracts, setContracts] = useState(null);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api().get("/api/docs-count");
                setContracts(response.data || []);
            } catch (err) {
                showErrorNotification("Ошибка при загрузке данных");
                setContracts([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Функция для получения данных контракта по типу
    const getContractData = (type) => {
        return CONTRACTS.find(contract => contract.name === type) || 
               { label: type, icon: <FileTextOutlined /> };
    };

    // Цвета для карточек
    const cardColors = [
        { bg: '#f0f5ff', border: '#1890ff', icon: '#1890ff' },
        { bg: '#fff7e6', border: '#faad14', icon: '#faad14' },
        { bg: '#e6fffb', border: '#13c2c2', icon: '#13c2c2' },
        { bg: '#f6ffed', border: '#52c41a', icon: '#52c41a' }
    ];

    if (loading) {
        return <Skeleton active paragraph={{ rows: 4 }} />;
    }

    if (!contracts || contracts.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '24px' }}>
                <Text type="secondary">Нет данных о договорах</Text>
            </div>
        );
    }

    return (
        <div>
            <hr />
            <h1>Статистика бухгалтера</h1>
            <h1>Статистика по договорам</h1>
            <Row gutter={16}>
                {contracts.map((contract, index) => {
                    const contractData = getContractData(contract.contract_type);
                    return (
                        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={contract.ID} style={{ marginBottom: '8px', margin: "0 auto" }}>
                            <CardStats
                                title={contractData.label}
                                value={contract.quantity}
                                icon={contractData.icon}
                                backgroundColor={cardColors[index % cardColors.length].bg}
                                borderColor={cardColors[index % cardColors.length].border}
                                iconColor={cardColors[index % cardColors.length].icon}
                            />
                        </Col>
                    );
                })}
            </Row>
            <IncomeFromOrders />
        </div>
    );
};

export default AccountantStats;
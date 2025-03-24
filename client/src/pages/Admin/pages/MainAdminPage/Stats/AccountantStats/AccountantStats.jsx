import React, { useLayoutEffect, useState } from "react";
import { Col, Row, Skeleton, Typography } from "antd";
import { ShoppingOutlined, FolderOutlined, FileTextOutlined, BarcodeOutlined } from "@ant-design/icons";
import api from "../../../../../../utils/api";
import showErrorNotification from "../../../../../../ui/Notification/Notification";
import CardStats from "../../../../components/CardStats/CardStats";

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

        const docs = async () => {
            try {
                const response = await api().get("/api/docs");
                console.log(response.data);
            } catch (err) {
                showErrorNotification("Ошибка при загрузке данных");
            }
        };

        docs();

        fetchData();
    }, []);

    // Функция для преобразования типа контракта в читаемый формат
    const getContractTitle = (type) => {
        const types = {
            'order': 'Договоры заказов',
            'storage': 'Договоры хранения',
            'service': 'Договоры услуг',
            'other': 'Прочие договоры'
        };
        return types[type] || type;
    };

    // Функция для выбора иконки по типу контракта
    const getContractIcon = (type) => {
        const icons = {
            'order': <ShoppingOutlined />,
            'storage': <FolderOutlined />,
            'service': <FileTextOutlined />,
            'other': <BarcodeOutlined />
        };
        return icons[type] || <FileTextOutlined />;
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
            <h1>Статистика по договорам</h1>
            <Row gutter={16}>
                {contracts.map((contract, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={contract.ID}>
                        <CardStats
                            title={getContractTitle(contract.contract_type)}
                            value={contract.quantity}
                            icon={getContractIcon(contract.contract_type)}
                            backgroundColor={cardColors[index % cardColors.length].bg}
                            borderColor={cardColors[index % cardColors.length].border}
                            iconColor={cardColors[index % cardColors.length].icon}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AccountantStats;
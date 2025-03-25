import React, { useState, useEffect, useRef } from "react";
import { Table, Tag, Button, Typography, Card, Input, Space } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import api from "../../../../utils/api";
import { showErrorNotification } from "../../../../ui/Notification/Notification";
import { generateCustomersExcel } from "./excelGenerator";
import Highlighter from "react-highlight-words";

const { Text, Title } = Typography;

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api().get("/api/customers");
                setCustomers(response.data);
                setFilteredCustomers(response.data);
                console.log(response.data);
            } catch (error) {
                showErrorNotification("Ошибка загрузки клиентов", error.response?.data?.error || "Неизвестная ошибка");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText("");
        setFilteredCustomers(customers);
        confirm();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Поиск по ${dataIndex === "name" ? "наименованию/ФИО" : dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}>
                        Поиск
                    </Button>
                    <Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "rgb(64, 150, 255)" : undefined,
                    fontSize: "20px",
                }}
            />
        ),
        onFilter: (value, record) => {
            if (dataIndex === "name") {
                const name = record.customer_type === "phys" ? `${record.surname} ${record.first_name} ${record.patronymic}` : record.name;
                return name.toLowerCase().includes(value.toLowerCase());
            }
            return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text, record) => {
            if (dataIndex === "name") {
                const name = record.customer_type === "phys" ? `${record.surname} ${record.first_name} ${record.patronymic}` : record.name;

                return searchText && searchedColumn === "name" ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={name}
                    />
                ) : (
                    name
                );
            }
            return text;
        },
    });

    const handleDownload = async () => {
        setExportLoading(true);
        try {
            await generateCustomersExcel(customers);
        } catch (error) {
            showErrorNotification("Ошибка экспорта", error.message);
        } finally {
            setExportLoading(false);
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "id",
            width: "4%",
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: "Тип клиента",
            dataIndex: "customer_type",
            key: "type",
            render: (type) => <Tag color={type === "phys" ? "blue" : "purple"}>{type === "phys" ? "Физ. лицо" : "Юр. лицо"}</Tag>,
            filters: [
                { text: "Физ. лицо", value: "phys" },
                { text: "Юр. лицо", value: "juri" },
            ],
            onFilter: (value, record) => record.customer_type === value,
            width: "9%",
        },
        {
            title: "Наименование орг. / ФИО",
            key: "name",
            ...getColumnSearchProps("name"),
            render: (_, record) => {
                const name = record.customer_type === "phys" ? `${record.surname} ${record.first_name} ${record.patronymic}` : record.name;

                return searchText && searchedColumn === "name" ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={name}
                    />
                ) : (
                    name
                );
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status) => <Tag color={status === "active" ? "green" : "red"}>{status === "active" ? "Не должник" : "Должник"}</Tag>,
            filters: [
                { text: "Не должник", value: "active" },
                { text: "Должник", value: "debt" },
            ],
            onFilter: (value, record) => record.status === value,
            width: "7%",
        },
        {
            title: "ИНН",
            dataIndex: "inn",
            key: "inn",
            render: (inn) => (inn ? inn : "-"),
        },
        {
            title: "Реквизиты",
            key: "payment",
            render: (record) =>
                record.customer_type === "juri" && record.payment_char ? (
                    <div>
                        <div>Банк: {record.payment_char.bank}</div>
                        <div>Счет: {record.payment_char.payment_number}</div>
                        <div>БИК: {record.payment_char.bik}</div>
                    </div>
                ) : (
                    "-"
                ),
        },
        {
            title: "Директор",
            dataIndex: "director",
            key: "director",
            render: (director, record) =>
                record.customer_type === "juri" && director ? (
                    <div>
                        <div>ФИО: {director}</div>
                    </div>
                ) : (
                    "-"
                ),
        },
        {
            title: "Главный бухгалтер",
            dataIndex: "main_booker",
            key: "main_booker",
            render: (main_booker, record) =>
                record.customer_type === "juri" && main_booker ? (
                    <div>
                        <div>ФИО: {main_booker}</div>
                    </div>
                ) : (
                    "-"
                ),
        },
        // {
        //     title: "Действия",
        //     key: "actions",
        //     width: 120,
        //     render: () => (
        //         <Space size="small">
        //             <Button size="small">Редактировать</Button>
        //         </Space>
        //     ),
        // },
    ];

    return (
        <div>
            <Title level={2}>Клиенты</Title>
            <Text type="secondary">Список всех зарегистрированных клиентов</Text>

            <Card style={{ marginTop: 16, backgroundColor: "rgba(226, 226, 226, 0.6)" }}>
                <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                    <Button loading={exportLoading} type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
                        Экспорт в Excel
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredCustomers.length > 0 ? filteredCustomers : customers}
                    rowKey="ID"
                    loading={loading}
                    bordered
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                        showTotal: (total) => `Всего ${total} клиентов`,
                    }}
                />
            </Card>
        </div>
    );
};

export default Customers;

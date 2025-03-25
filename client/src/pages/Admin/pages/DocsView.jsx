import React, { useState, useEffect, useRef } from "react";
import { Table, Card, Button, Typography, Spin, Modal, ConfigProvider, Input, Empty } from "antd";
import { DownloadOutlined, EyeOutlined, FileTextOutlined, SearchOutlined, FileExclamationOutlined } from "@ant-design/icons";
import { renderAsync } from "docx-preview";
import { CONTRACTS } from "../../../constants/contracts";
import api from "../../../utils/api";
import { showSuccessNotification, showErrorNotification } from "../../../ui/Notification/Notification";
import Highlighter from "react-highlight-words";

const { Title, Text } = Typography;

const getDocType = (type) => {
    const contract = CONTRACTS.find((item) => item.name === type);
    return (
        contract || {
            name: type,
            label: type,
            icon: <FileTextOutlined />,
            color: "#888",
        }
    );
};

const DOC_COLORS = {
    order: "#1890ff",
    storage: "#faad14",
    service: "#52c41a",
    payment: "#13c2c2",
    other: "#722ed1",
};

const DocsView = () => {
    const [contracts, setContracts] = useState([]);
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [downloadingDocs, setDownloadingDocs] = useState({});
    const [docLoading, setDocLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Состояние для текущей страницы
    const [currentPageSize, setCurrentPageSize] = useState(15);
    const [errorPreview, setErrorPreview] = useState(false);
    const searchInput = useRef(null);
    const previewRef = useRef(null);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await api().get("/api/docs");
                setContracts(response.data.docs || []);
                setFilteredContracts(response.data.docs || []);
            } catch (error) {
                showErrorNotification("Ошибка загрузки списка документов");
            } finally {
                setLoading(false);
            }
        };
        fetchContracts();
    }, []);

    useEffect(() => {
        document.title = "Договора и документы";
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        const searchValue = selectedKeys[0];
        setSearchText(searchValue);
        setSearchedColumn(dataIndex);

        if (searchValue) {
            const filtered = contracts.filter((record) => record[dataIndex]?.toString().toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredContracts(filtered);
        } else {
            setFilteredContracts(contracts);
        }
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText("");
        setFilteredContracts(contracts);
        confirm();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Поиск по ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                </div>
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
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
        filtedDropdownProps: {
            opOpenChange: (open) => {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            }
        }
    });

    const handlePreview = async (doc) => {
        try {
            setDocLoading(true);
            setPreviewVisible(true);
            setPreviewDoc(doc);
            setErrorPreview(false);
            
            // Очищаем предыдущий контент перед загрузкой нового
            if (previewRef.current) {
                previewRef.current.innerHTML = "";
            }
    
            const response = await api().get(`/api/docs/${doc.ID}/file`, { responseType: "arraybuffer" });
    
            if (previewRef.current) {
                await renderAsync(response.data, previewRef.current, null, { className: "docx-container" });
            }
        } catch (error) {
            showErrorNotification("Ошибка загрузки документа");
            setErrorPreview(true);
            // При ошибке тоже очищаем previewRef
            if (previewRef.current) {
                previewRef.current.innerHTML = "";
            }
        } finally {
            setDocLoading(false);
        }
    };
    

    const handleDownload = async (doc) => {
        try {
            setErrorPreview(false);
            setDownloadingDocs((prev) => ({ ...prev, [doc.ID]: true }));
            const response = await api().get(`/api/docs/${doc.ID}/file`, { responseType: "blob" });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.download = `${doc.type}_${doc.ID}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showSuccessNotification("Документ скачан");
        } catch (error) {
            showErrorNotification("Ошибка при скачивании документа");
        } finally {
            setDownloadingDocs((prev) => ({ ...prev, [doc.ID]: false }));
        }
    };

    const closePreview = () => {
        setPreviewVisible(false);
        setPreviewDoc(null);
        setErrorPreview(false);
        if (previewRef.current) {
            previewRef.current.innerHTML = ""; // Очищаем содержимое предпросмотра
        }
    };

    const columns = [
        {
            title: "№",
            key: "id",
            width: "5%",
            render: (text, record, index) => {
                const rowNumber = (currentPage - 1) * currentPageSize + index + 1;
                return rowNumber;
            },
        },
        {
            title: "Номер заказа",
            dataIndex: "order_id",
            key: "order_id",
            width: 200,
            ...getColumnSearchProps("order_id"),
        },
        {
            title: "Количество документов",
            key: "doc_count",
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "black" }}>
                        <span style={{ border: "1px solid #d9d9d9", paddingLeft: 8, paddingRight: 8, borderRadius: 6, backgroundColor: "#f0f0f0" }}>
                            {(record.docs || []).length}
                        </span>
                    </div>
                );
            },
            width: "9%",
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <Button type="link" onClick={() => handlePreview(record.docs[0])} loading={loading}>
                    Просмотр договор заказа (первый документ)
                </Button>
            ),
        },
    ];

    const expandedRowRender = (record) => {
        const docsColumns = [
            {
                title: "Тип документа",
                dataIndex: "type",
                key: "type",
                render: (type) => {
                    const docType = getDocType(type);
                    const color = DOC_COLORS[type] || DOC_COLORS.other;
                    return (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ color, marginRight: 8 }}>{docType.icon}</span>
                            {docType.label}
                        </div>
                    );
                },
                width: 250,
            },
            {
                title: "Действия",
                key: "actions",
                render: (_, doc) => (
                    <div style={{ display: "flex", gap: 8 }}>
                        <Button icon={<EyeOutlined />} onClick={() => handlePreview(doc)} loading={loading}>
                            Просмотр
                        </Button>
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownload(doc)} loading={!!downloadingDocs[doc.ID]}>
                            Скачать
                        </Button>
                    </div>
                ),
            },
        ];

        return <Table columns={docsColumns} dataSource={record.docs || []} bordered rowKey="ID" pagination={false} size="small" />;
    };

    return (
        <div style={{ width: "85%", margin: "0 auto" }}>
            <Title level={2} style={{ marginBottom: 8 }}>
                Договоры и документы
            </Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                Просмотр и управление всеми документами
            </Text>

            <Card style={{ marginTop: 24, backgroundColor: "rgba(226, 226, 226, 0.6)", borderRadius: "8px" }}>
                <Spin spinning={loading}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Table: {
                                    cellFontSize: 16,
                                },
                            },
                        }}>
                        <Table
                            columns={columns}
                            dataSource={filteredContracts}
                            pagination={{
                                defaultPageSize: 10,
                                showSizeChanger: true,
                                position: ["topRight", "bottomRight"],
                                pageSizeOptions: ["10", "15", "25"],
                                locale: {
                                    items_per_page: "/ на странице",
                                },
                                onChange: (page, pageSize) => {
                                    setCurrentPageSize(pageSize);
                                    setCurrentPage(page);
                                    document.documentElement.scrollTop = 0;
                                },
                            }}
                            rowKey="order_id"
                            bordered
                            locale={{
                                emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет договоров или документов"></Empty>,
                            }}
                            expandable={{ expandedRowRender }}
                        />
                    </ConfigProvider>
                </Spin>
            </Card>

            <Modal title="Предпросмотр документа" open={previewVisible} onCancel={closePreview} footer={null} width={900}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                    }}>
                    <Title level={4} style={{ margin: 0 }}>
                        {previewDoc && getDocType(previewDoc.type).label}
                    </Title>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={() => previewDoc && handleDownload(previewDoc)}>
                        Скачать
                    </Button>
                </div>
                <Spin spinning={docLoading}>
                    {errorPreview ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 300,
                                color: "#ff4d4f",
                                backgroundColor: "#fff2f0",
                                borderRadius: 8,
                                border: "1px dashed #ffccc7",
                                padding: 20,
                                textAlign: "center",
                            }}>
                            <FileExclamationOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Ошибка при загрузке документа</div>
                            <div style={{ color: "#595959" }}>Не удалось отобразить содержимое файла</div>
                        </div>
                    ) : (
                        <div ref={previewRef} className="docx-preview" style={{ minHeight: 300, maxHeight: 600, overflow: "auto" }} />
                    )}
                </Spin>
            </Modal>
        </div>
    );
};

export default DocsView;

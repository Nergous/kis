import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Typography, Spin, message } from 'antd';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { FileTextOutlined } from '@ant-design/icons';
import api from '../../../utils/api';
import { CONTRACTS } from '../../../constants/contracts';

const { Title, Text } = Typography;

// Функция для получения данных документа по типу
const getDocType = (type) => {
  const contract = CONTRACTS.find(item => item.name === type);
  return contract || { 
    name: type, 
    label: type, 
    icon: <FileTextOutlined />,
    color: '#888' 
  };
};

// Цвета для разных типов документов
const DOC_COLORS = {
  order: '#1890ff',
  storage: '#faad14',
  service: '#52c41a',
  payment: '#13c2c2',
  other: '#722ed1'
};

const DocsView = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await api().get('/api/docs');
        const docsWithoutFiles = response.data.docs?.map(contract => ({
          ...contract,
          docs: contract.docs?.map(doc => ({
            ...doc,
            file_content: null
          }))
        })) || [];
        setContracts(docsWithoutFiles);
      } catch (error) {
        message.error('Ошибка загрузки списка договоров');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const handlePreview = async (doc) => {
    try {
      setLoading(true);
      const response = await api().get(`/api/docs/${doc.ID}/file`);
      setPreviewDoc({
        ...doc,
        file_path: response.data.file_url || doc.file_path
      });
      setPreviewVisible(true);
    } catch (error) {
      message.error('Ошибка загрузки документа для просмотра');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      setDownloading(true);
      const response = await api().get(`/api/docs/${doc.ID}/file`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const docType = getDocType(doc.type);
      
      link.href = url;
      link.download = `${docType.label.replace(/\s+/g, '_')}_${doc.ID}.docx`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      message.success(`Документ "${docType.label}" скачивается`);
    } catch (error) {
      message.error('Ошибка при скачивании документа');
    } finally {
      setDownloading(false);
    }
  };

  const closePreview = () => {
    setPreviewVisible(false);
    setPreviewDoc(null);
  };

  const columns = [
    {
      title: 'Номер заказа',
      dataIndex: 'order_id',
      key: 'order_id',
      width: 200,
    },
    {
      title: 'Количество документов',
      key: 'doc_count',
      render: (_, record) => (record.docs || []).length,
      width: 200,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handlePreview(record.docs[0])}
          loading={loading}
        >
          Просмотр первого документа
        </Button>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const docsColumns = [
      {
        title: 'Тип документа',
        dataIndex: 'type',
        key: 'type',
        render: (type) => {
          const docType = getDocType(type);
          const color = DOC_COLORS[type] || DOC_COLORS.other;
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color, marginRight: 8 }}>
                {docType.icon}
              </span>
              {docType.label}
            </div>
          );
        },
        width: 250,
      },
      {
        title: 'Действия',
        key: 'actions',
        render: (_, doc) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              type="link" 
              onClick={() => handlePreview(doc)}
              loading={loading}
            >
              Просмотр
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={() => handleDownload(doc)}
              loading={downloading}
            >
              Скачать
            </Button>
          </div>
        ),
      },
    ];

    return (
      <Table
        columns={docsColumns}
        dataSource={record.docs || []}
        rowKey="ID"
        pagination={false}
        size="small"
        style={{ backgroundColor: '#fafafa' }}
      />
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 8 }}>Договоры и документы</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Просмотр и управление всеми документами
      </Text>

      <Card style={{ marginTop: 24 }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={contracts}
            rowKey="order_id"
            expandable={{ expandedRowRender }}
            scroll={{ x: true }}
          />
        </Spin>
      </Card>

      {previewVisible && previewDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 8,
            width: '80%',
            maxWidth: 900,
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <Button 
              icon={<CloseOutlined />} 
              onClick={closePreview}
              style={{
                position: 'absolute',
                right: 16,
                top: 16,
                zIndex: 1
              }}
            />
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <Title level={4} style={{ margin: 0 }}>
                {getDocType(previewDoc.type).label}
              </Title>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => handleDownload(previewDoc)}
                loading={downloading}
              >
                Скачать
              </Button>
            </div>
            
            <div style={{ 
              border: '1px solid #f0f0f0',
              padding: 16,
              borderRadius: 4,
              minHeight: 200,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}>
              {getDocType(previewDoc.type).icon}
              <p style={{ marginTop: 16 }}>Предпросмотр .docx/.doc не поддерживается в браузере</p>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => handleDownload(previewDoc)}
                style={{ marginTop: 16 }}
                loading={downloading}
              >
                Скачать для просмотра
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocsView;
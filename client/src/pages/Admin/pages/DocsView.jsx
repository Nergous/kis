import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Typography, Spin, message } from 'antd';
import { DownloadOutlined, FileWordOutlined, CloseOutlined } from '@ant-design/icons';
import api from '../../../utils/api';

const { Title, Text } = Typography;

const DOC_TYPES = {
  order: { name: 'Договор заказа', icon: <FileWordOutlined />, color: '#1890ff' },
  storage: { name: 'Накладная', icon: <FileWordOutlined />, color: '#faad14' },
  receipt: { name: 'Акт получения', icon: <FileWordOutlined />, color: '#52c41a' },
  payment: { name: 'Договор оплаты', icon: <FileWordOutlined />, color: '#13c2c2' },
  unknown: { name: 'Документ', icon: <FileWordOutlined />, color: '#888' }
};

const getDocType = (type) => {
  return DOC_TYPES[type] || DOC_TYPES.unknown;
};

const DocsView = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await api().get('/api/docs');
        setContracts(response.data.docs || []);
      } catch (error) {
        message.error('Ошибка загрузки договоров');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const handlePreview = (doc) => {
    setPreviewDoc(doc);
    setPreviewVisible(true);
  };

  const handleDownload = async (doc) => {
    try {
      const docType = getDocType(doc.type);
      const link = document.createElement('a');
      link.href = doc.file_path;
      link.download = `${docType.name}_${doc.ID}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(`Документ "${docType.name}" скачивается`);
    } catch (error) {
      message.error('Ошибка при скачивании');
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
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: docType.color, marginRight: 8 }}>
                {docType.icon}
              </span>
              {docType.name}
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
            >
              Просмотр
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={() => handleDownload(doc)}
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
                {getDocType(previewDoc.type).name}
              </Title>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => handleDownload(previewDoc)}
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
              <FileWordOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              <p style={{ marginTop: 16 }}>Предпросмотр .docx/.doc не поддерживается в браузере</p>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => handleDownload(previewDoc)}
                style={{ marginTop: 16 }}
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
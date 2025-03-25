import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Space, Divider, Typography, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CreditCardOutlined, WalletOutlined, DollarOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const OrderModal = ({ visible, onCancel, onSubmit, cartItems, totalAmount }) => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState('prepayment');

  const disabledDate = current => current && current < moment().add(3, 'days').startOf('day');

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const orderData = {
        ...values,
        delivery_date: values.delivery_date.toISOString(),
        payment_terms: paymentMethod,
        total_price: totalAmount,
        order_content: cartItems.map(item => ({
          product_id: item.ID,
          quantity: item.quantity,
          price: item.price,
          total_product_price: item.price * item.quantity
        }))
      };
      onSubmit(orderData);
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  return (
    <Modal
      title="Оформление заказа"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} icon={<CloseCircleOutlined />} style={{ borderRadius: 5 }}>
          Отмена
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit} 
          icon={<CheckCircleOutlined />} 
          style={{ borderRadius: 5, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
        >
          Подтвердить заказ
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Телефон получателя"
          name="recipient_phone"
          rules={[
            { required: true, message: 'Введите номер телефона' },
            { 
              pattern: /^\+7\d{10}$/, 
              message: 'Формат: +7XXXXXXXXXX' 
            }
          ]}
        >
          <Input placeholder="+79991234567" />
        </Form.Item>

        <Form.Item
          label="Адрес доставки"
          name="address"
          rules={[{ required: true, message: 'Введите адрес доставки' }]}
        >
          <Input placeholder="г. Москва, ул. Примерная, д. 1" />
        </Form.Item>

        <Form.Item
          label="Дата доставки"
          name="delivery_date"
          rules={[{ required: true, message: 'Выберите дату доставки' }]}
        >
          <DatePicker
            showTime
            format="DD.MM.YYYY HH:mm"
            disabledDate={disabledDate}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Способ оплаты" required>
          <Radio.Group
            onChange={e => setPaymentMethod(e.target.value)}
            value={paymentMethod}
          >
            <Space direction="vertical">
              <Radio value="prepayment">
                <CreditCardOutlined /> Предоплата
              </Radio>
              <Radio value="postpayment">
                <WalletOutlined /> Постоплата
              </Radio>
              <Radio value="full_payment">
                <DollarOutlined /> Полная оплата
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Divider>Состав заказа</Divider>
        
        {cartItems.map(item => (
          <div key={item.ID} style={{ marginBottom: 8 }}>
            <Text strong>{item.name}</Text>
            <br />
            <Text type="secondary">
              {item.quantity} × {item.price} ₽ = {(item.quantity * item.price).toLocaleString('ru-RU')} ₽
            </Text>
          </div>
        ))}

        <Divider />
        
        <Text strong style={{ 
          display: 'block', 
          textAlign: 'right', 
          fontSize: 18 
        }}>
          Итого: {totalAmount.toLocaleString('ru-RU')} ₽
        </Text>
      </Form>
    </Modal>
  );
};

export default OrderModal;
import React from "react";
import { Tabs } from "antd";
import { Phone, Email, Assignment, Archive } from "@mui/icons-material";
import "antd/dist/reset.css";
import "../../../fonts.css";

const userInfo = {
  name: "Смирнов Артём Владимирович",
  phone: "+79812835464",
  email: "as9291272@lesopilka.com"
};

const orders = {
  current: [
    {
      id: 14523,
      date: "2024-03-15",
      status: "В производстве",
      total: "45.200₽",
      products: [
        { name: "Брус клеёный", quantity: 40, price: "1.110₽/шт" },
        { name: "Доска обрезная", quantity: 15, price: "10.050₽/м3" }
      ]
    },
    {
      id: 14519,
      date: "2024-03-12",
      status: "Ожидает оплаты",
      total: "23.700₽",
      products: [
        { name: "Фанера", quantity: 50, price: "420₽/лист" },
        { name: "Рейка", quantity: 200, price: "17₽/пм" }
      ]
    }
  ],
  archived: [
    {
      id: 14498,
      date: "2024-02-28",
      status: "Завершен",
      total: "68.900₽",
      products: [
        { name: "Брусок строганный", quantity: 1000, price: "35₽/пм" },
        { name: "Доска сухая", quantity: 80, price: "1.370₽/шт" }
      ]
    }
  ]
};

const UserProfileCard = () => (
  <div style={{
    background: "white",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: 30
  }}>
    <h1 style={{
      fontFamily: "'DMSans-Medium', sans-serif",
      color: "#085615",
      marginBottom: 25
    }}>
      Личный кабинет
    </h1>
    
    <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "#e8f5e9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        color: "#085615"
      }}>
        {userInfo.name[0]}
      </div>
      
      <div>
        <h2 style={{
          fontFamily: "'DMSans-Medium', sans-serif",
          color: "#085615",
          margin: 0
        }}>
          {userInfo.name}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <Phone fontSize="small" style={{ color: "#666" }} />
          <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
            {userInfo.phone}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          <Email fontSize="small" style={{ color: "#666" }} />
          <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>
            {userInfo.email}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const OrderCard = ({ order }) => (
  <div style={{
    background: "white",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: 15
  }}>
    <div style={{ 
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }}>
      <div>
        <span style={{ 
          fontFamily: "'DMSans-Medium', sans-serif",
          color: "#085615",
          marginRight: 15
        }}>
          Заказ №{order.id}
        </span>
        <span style={{ 
          background: "#e8f5e9",
          borderRadius: 15,
          padding: "4px 12px",
          fontSize: 12,
          color: "#085615"
        }}>
          {order.status}
        </span>
      </div>
      <span style={{ 
        fontFamily: "'DMSans-Medium', sans-serif",
        color: "#085615"
      }}>
        {order.total}
      </span>
    </div>
    
    <div style={{ 
      borderTop: "1px solid #eee",
      paddingTop: 12,
      marginBottom: 12
    }}>
      {order.products.map((product, index) => (
        <div key={index} style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontFamily: "'DMSans-Regular', sans-serif"
        }}>
          <span>{product.name}</span>
          <span>{product.quantity} × {product.price}</span>
        </div>
      ))}
    </div>
    
    <div style={{ 
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#666",
      fontSize: 12
    }}>
      <span>Дата заказа: {order.date}</span>
      <span>Способ получения: Самовывоз</span>
    </div>
  </div>
);

const ClientPage = () => (
  <div style={{ padding: "20px 40px" }}>
    <UserProfileCard />
    
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          key: "1",
          label: (
            <span style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>
              <Assignment style={{ marginRight: 8 }} />
              Текущие заказы ({orders.current.length})
            </span>
          ),
          children: orders.current.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        },
        {
          key: "2",
          label: (
            <span style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>
              <Archive style={{ marginRight: 8 }} />
              Архив ({orders.archived.length})
            </span>
          ),
          children: orders.archived.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        }
      ]}
    />
  </div>
);

export default ClientPage;
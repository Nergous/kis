import React from "react";
import { Layout } from "antd";
import "antd/dist/reset.css";
import background from "../../../background.png";
import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <AppHeader />
      <Layout>
      <AppSidebar />
      <Content
        style={{
          padding: 20,
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {children}
      </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

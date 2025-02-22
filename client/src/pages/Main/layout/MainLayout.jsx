import React from "react";
import { Layout } from "antd";
import "antd/dist/reset.css";
import background from "../../../background.png";
import AppHeader from "../components/AppHeader";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <AppHeader />
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
  );
};

export default MainLayout;

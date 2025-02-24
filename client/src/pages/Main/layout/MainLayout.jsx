import React from "react";
import { Layout } from "antd";
import "antd/dist/reset.css";
import leftBlob from "../../../assets/left.png"; // Убедитесь в правильности пути
import rightBlob from "../../../assets/right.png"; // Убедитесь в правильности пути
import AppHeader from "../components/AppHeader";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh", position: "relative", background: '' }}>
      {/* Левая клякса */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: "50%",
          transform: "translateY(-70%)",
          zIndex: 0,
          width: "40%",
          maxWidth: "1397px",
          height: "80%",
          backgroundImage: `url(${leftBlob})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
          opacity: 1,
          marginLeft: "-10%",
          pointerEvents: "none",
        }}
      />

      {/* Правая клякса */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "translateY(-20%)",
          zIndex: 0,
          width: "100%",
          maxWidth: "1397px",
          height: "80%",
          backgroundImage: `url(${rightBlob})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          opacity: 1,
          marginRight: "-15%",
          pointerEvents: "none",
        }}
      />
      
      <AppHeader />
      <Content
        style={{
          padding: 20,
          position: "relative",
          zIndex: 1,
          minHeight: '100vh',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;
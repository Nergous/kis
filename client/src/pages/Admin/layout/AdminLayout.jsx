import React from "react";
import { Layout } from "antd";
import "antd/dist/reset.css";
import leftBlob from "../../../assets/left.png"; // Убедитесь в правильности пути
import rightBlob from "../../../assets/right.png"; // Убедитесь в правильности пути
import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";

const { Content } = Layout;

const AdminLayout = ({ children }) => {
    return (
        <Layout
            style={{
                maxHeight: "100vh",
                position: "relative",
                background: "white",
            }}
        >
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

            {/* <div style={{ position: "sticky", top: 0, zIndex: 10 }}> */}
            <AppHeader />
            {/* </div> */}
            <Layout>
                <AppSidebar />
                <Content
                    style={{
                        padding: 20,
                        position: "relative",
                        zIndex: 1,
                        // height: "100vh",
                        overflow: "auto",
                        // display: "flex",
                        // flexDirection: "column",
                        marginLeft: "250px", // Да да, захардкодил, но по другому я хз как
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;

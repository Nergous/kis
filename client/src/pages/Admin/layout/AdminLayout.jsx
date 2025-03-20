import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import "antd/dist/reset.css";
import leftBlob from "../../../assets/left.png"; // Убедитесь в правильности пути
import rightBlob from "../../../assets/right.png"; // Убедитесь в правильности пути
import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";
import Notification from "../../../ui/Notification/Notification";
import c from "./AdminLayout.module.css";
import { FaThumbtack } from "react-icons/fa"; // Используем иконки канцелярских кнопок
// import ASCIIText from "../../../components/ASCIIText/ASCIIText";

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const [clickedButtons, setClickedButtons] = useState([false, false, false, false]);
  const [pageDown, setPageDown] = useState(false);
  const [showRestoreButton, setShowRestoreButton] = useState(false);

  useEffect(() => {
    const pageDownStatus = localStorage.getItem("page down");
    if (pageDownStatus === "true") {
      setPageDown(true);
      console.log("Page down status from localStorage: true");
      setTimeout(() => {
        setShowRestoreButton(true);
        console.log("Restore button should be visible now");
      }, 2000);
    }
  }, []);

  const handleButtonClick = (index) => {
    const newClickedButtons = [...clickedButtons];
    newClickedButtons[index] = !newClickedButtons[index];
    setClickedButtons(newClickedButtons);

    const totalClicked = newClickedButtons.filter(Boolean).length;

    if (totalClicked === 4 && !pageDown) {
      localStorage.setItem("page down", "true");
      setPageDown(true);
      console.log("All buttons clicked, page down set to true");
      setTimeout(() => {
        setShowRestoreButton(true);
        console.log("Restore button should be visible now");
      }, 2000);
    }
  };

  const handleRestorePage = () => {
    localStorage.removeItem("page down");
    setPageDown(false);
    setShowRestoreButton(false);
    console.log("Page restored, restore button hidden");
  };

  if (pageDown) {
    return (
      <div className={c.PageDownWrapper}>
        <div className={c.FallingPage}>
          <div className={c.PageDownText}>Страница упала!</div>

          {showRestoreButton && (
            <button className={c.RestoreButton} onClick={handleRestorePage}>
              Поднять страницу
            </button>
          )}
        </div>
      </div>
    );
  }

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

      <AppHeader />
      <Layout>
        <AppSidebar />
        <Content
          className={c.AdminContent}
          style={{
            padding: 20,
            position: "relative",
            zIndex: 1,
            overflow: "auto",
            marginLeft: "250px", // Да да, захардкодил, но по другому я хз как
          }}
        >
          {children}
          <Notification />
        </Content>
      </Layout>

      {/* Кнопки по углам */}
      <button
        onClick={() => handleButtonClick(0)}
        className={`${c.CornerButton} ${c.TopLeft} ${clickedButtons[0] ? c.CornerButtonActive : ''}`}
      >
        <FaThumbtack />
      </button>

      <button
        onClick={() => handleButtonClick(1)}
        className={`${c.CornerButton} ${c.TopRight} ${clickedButtons[1] ? c.CornerButtonActive : ''}`}
      >
        <FaThumbtack />
      </button>

      <button
        onClick={() => handleButtonClick(2)}
        className={`${c.CornerButton} ${c.BottomLeft} ${clickedButtons[2] ? c.CornerButtonActive : ''}`}
      >
        <FaThumbtack />
      </button>

      <button
        onClick={() => handleButtonClick(3)}
        className={`${c.CornerButton} ${c.BottomRight} ${clickedButtons[3] ? c.CornerButtonActive : ''}`}
      >
        <FaThumbtack />
      </button>
    </Layout>
  );
};

export default AdminLayout;
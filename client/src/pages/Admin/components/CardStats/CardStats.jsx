import React from "react";
import { Card, Typography } from "antd";
import CountUp from "../../../../components/CountUp/CountUp";

const { Text } = Typography;

const CardStats = ({ 
  title, 
  value, 
  icon, 
  backgroundColor = '#fafafa', 
  borderColor = '#e8e8e8', 
  iconColor = '#1890ff',
  loading = false
}) => {
  const cardStyle = {
    borderRadius: '12px',
    border: `1px solid ${borderColor}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    marginBottom: '20px',
  };

  const hoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  };

  const headStyle = {
    borderBottom: 'none',
    padding: '0 16px',
    minHeight: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: backgroundColor,
  };

  const bodyStyle = {
    padding: '20px',
    background: 'white',
  };

  const iconWrapperStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `rgba(${hexToRgb(iconColor)}, 0.1)`,
    margin: '0 auto',
  };

  const iconStyle = {
    fontSize: '24px',
    color: iconColor,
  };

  const titleStyle = {
    display: 'block',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    fontWeight: '500',
  };

  const valueStyle = {
    fontSize: '28px',
    fontWeight: '600',
    color: '#222',
    lineHeight: '1.2',
  };

  // Вспомогательная функция для преобразования HEX в RGB
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      style={{
        ...cardStyle,
        ...(isHovered ? hoverStyle : {}),
      }}
      styles={{
        header: headStyle,
        body: bodyStyle,
      }}
      loading={loading}
      title={
        <div style={iconWrapperStyle}>
          {React.cloneElement(icon, { style: iconStyle })}
        </div>
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Text style={titleStyle}>{title}</Text>
      <div style={valueStyle}>
        <CountUp 
          from={0} 
          to={value} 
          separator="," 
          direction="up" 
          duration={1.5} 
          decimals={0}
        />
      </div>
    </Card>
  );
};

export default CardStats;
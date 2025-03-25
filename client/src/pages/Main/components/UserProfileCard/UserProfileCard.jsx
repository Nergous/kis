import React, { useState } from "react";
import { Email } from "@mui/icons-material";

const UserProfileCard = ({ userData }) => {
    const [showConsent, setShowConsent] = useState(false);
    
    if (!userData) return null;

    const isPhysicalPerson = userData.customer_type === "phys";
    const fullName = isPhysicalPerson 
        ? `${userData.surname || ""} ${userData.first_name || ""} ${userData.patronymic || ""}`.trim()
        : userData.name || ""; // For business, use main_booker as the primary name
    
    const firstLetter = isPhysicalPerson 
        ? (userData.surname && userData.surname[0]) || "П" 
        : (userData.name && userData.name[0]) || "К";
    
    const customerTypeText = isPhysicalPerson ? "Физическое лицо" : "Юридическое лицо";
    
    const consentName = isPhysicalPerson 
        ? fullName 
        : userData.director || "";
    
    const toggleConsent = () => {
        setShowConsent(!showConsent);
    };
    
    // Status badge colors and texts
    const statusBadges = {
        "debt": {
            text: "Должник",
            backgroundColor: "#ffebee",
            color: "#d32f2f"
        },
        "active": {
            text: "Без задолжности",
            backgroundColor: "#e8f5e9",
            color: "#2E7D32"
        }
    };

    const currentStatusBadge = statusBadges[userData.status] || statusBadges["active"];
    
    return (
        <div
            style={{
                background: "white",
                borderRadius: "20px",
                padding: "25px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                marginBottom: 30,
            }}>
            <h1
                style={{
                    fontFamily: "'DMSans-Medium', sans-serif",
                    color: "#085615",
                    marginBottom: 25,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                <span>Личный кабинет</span>
                <div style={{ display: "flex", gap: "10px" }}>
                    <div 
                        style={{ 
                            display: "inline-block", 
                            background: "#e8f5e9", 
                            borderRadius: 15, 
                            padding: "4px 12px", 
                            fontSize: 14, 
                            color: "#085615",
                        }}>
                        {customerTypeText}
                    </div>
                    <div 
                        style={{ 
                            display: "inline-block", 
                            background: currentStatusBadge.backgroundColor, 
                            borderRadius: 15, 
                            padding: "4px 12px", 
                            fontSize: 14, 
                            color: currentStatusBadge.color,
                        }}>
                        {currentStatusBadge.text}
                    </div>
                </div>
            </h1>

            <div style={{ display: "flex", gap: 25 }}>
                {/* Left column with avatar */}
                <div>
                    <div
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            background: "#e8f5e9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 32,
                            color: "#085615",
                            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
                        }}>
                        {firstLetter}
                    </div>
                </div>

                {/* Main content area */}
                <div style={{ flex: 1 }}>
                    {/* Physical person information */}
                    {isPhysicalPerson && (
                        <div>
                            <h2
                                style={{
                                    fontFamily: "'DMSans-Medium', sans-serif",
                                    color: "#085615",
                                    margin: 0,
                                    marginBottom: 16,
                                    fontSize: 22
                                }}>
                                {fullName}
                            </h2>
                            
                            <div style={{ 
                                display: "flex", 
                                flexWrap: "wrap",
                                gap: "16px"
                            }}>
                                {userData.email && (
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 10,
                                        background: "#f9f9f9",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        minWidth: "200px"
                                    }}>
                                        <Email fontSize="small" style={{ color: "#085615" }} />
                                        <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>{userData.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Business information */}
                    {!isPhysicalPerson && (
                        <div>
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between",
                                marginBottom: 16
                            }}>
                                <h2
                                    style={{
                                        fontFamily: "'DMSans-Medium', sans-serif",
                                        color: "#085615",
                                        margin: 0,
                                        fontSize: 22
                                    }}>
                                    {fullName}
                                </h2>
                                
                                {userData.inn && (
                                    <div style={{ 
                                        background: "#f9f9f9",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        fontFamily: "'DMSans-Medium', sans-serif",
                                    }}>
                                        <span style={{ color: "#666" }}>ИНН: </span>
                                        <span>{userData.inn}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "16px",
                                marginBottom: 20
                            }}>
                                {userData.email && (
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 10,
                                        background: "#f9f9f9",
                                        padding: "8px 16px",
                                        borderRadius: "8px"
                                    }}>
                                        <Email fontSize="small" style={{ color: "#085615" }} />
                                        <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>{userData.email}</span>
                                    </div>
                                )}
                                
                                {userData.director && (
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 10,
                                        background: "#f9f9f9",
                                        padding: "8px 16px",
                                        borderRadius: "8px"
                                    }}>
                                        <span style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666" }}>Директор:</span>
                                        <span style={{ fontFamily: "'DMSans-Regular', sans-serif" }}>{userData.director}</span>
                                    </div>
                                )}
                            </div>
                            
                            {userData.payment_char && (
                                <div style={{ 
                                    marginTop: 16, 
                                    borderTop: "1px solid #eee", 
                                    paddingTop: 16 
                                }}>
                                    <div style={{ 
                                        fontFamily: "'DMSans-Medium', sans-serif", 
                                        marginBottom: 12,
                                        color: "#085615",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="6" width="18" height="12" rx="2" stroke="#085615" strokeWidth="2"/>
                                            <path d="M3 10H21" stroke="#085615" strokeWidth="2"/>
                                            <path d="M7 15H13" stroke="#085615" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        Платежная информация
                                    </div>
                                    
                                    <div style={{ 
                                        display: "grid", 
                                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                        gap: "12px" 
                                    }}>
                                        <div style={{ 
                                            padding: "8px 12px",
                                            background: "#f9f9f9",
                                            borderRadius: "8px"
                                        }}>
                                            <div style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666", fontSize: "12px" }}>Банк:</div>
                                            <div style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>{userData.payment_char.bank}</div>
                                        </div>
                                        
                                        <div style={{ 
                                            padding: "8px 12px",
                                            background: "#f9f9f9",
                                            borderRadius: "8px"
                                        }}>
                                            <div style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666", fontSize: "12px" }}>БИК:</div>
                                            <div style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>{userData.payment_char.bik}</div>
                                        </div>
                                        
                                        <div style={{ 
                                            padding: "8px 12px",
                                            background: "#f9f9f9",
                                            borderRadius: "8px",
                                        }}>
                                            <div style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666", fontSize: "12px" }}>Расчетный счет:</div>
                                            <div style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>{userData.payment_char.payment_number}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Согласие на обработку персональных данных */}
            <div style={{ 
                marginTop: 30,
                borderTop: "1px solid #eee",
                paddingTop: 20
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 15
                }}>
                    <div style={{ 
                        fontFamily: "'DMSans-Medium', sans-serif", 
                        color: "#085615",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 3V7C14 7.55228 14.4477 8 15 8H19" stroke="#085615" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14L19 8V19C19 20.1046 18.1046 21 17 21Z" stroke="#085615" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 12H15" stroke="#085615" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 16H15" stroke="#085615" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Согласие на обработку персональных данных
                    </div>
                    <button 
                        onClick={toggleConsent}
                        style={{
                            background: "#e8f5e9",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 16px",
                            color: "#085615",
                            fontFamily: "'DMSans-Medium', sans-serif",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        {showConsent ? "Скрыть" : "Показать"}
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                transform: showConsent ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.3s ease"
                            }}
                        >
                            <path d="M6 9L12 15L18 9" stroke="#085615" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                {showConsent && (
                    <div style={{
                        background: "#f9f9f9",
                        padding: "20px",
                        borderRadius: "10px",
                        fontFamily: "'DMSans-Regular', sans-serif",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        color: "#333"
                    }}>
                        <p style={{ fontWeight: "bold", marginTop: 0, marginBottom: 16 }}>
                            СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ
                        </p>
                        
                        <p>
                            Я, {consentName}, даю свое согласие на обработку моих персональных данных, в соответствии с Федеральным законом от 27.07.2006 года №152-ФЗ «О персональных данных».
                        </p>
                        
                        <p>
                            Согласие распространяется на следующие персональные данные: фамилия, имя, отчество; контактная информация (адрес электронной почты, номер телефона).
                        </p>
                        
                        <p>
                            Согласие предоставляется на осуществление любых действий в отношении моих персональных данных, которые необходимы для достижения указанных выше целей, включая (без ограничения) сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение), использование, передачу третьим лицам для осуществления действий по обмену информацией, обезличивание, блокирование персональных данных, а также осуществление любых иных действий, предусмотренных действующим законодательством Российской Федерации.
                        </p>
                        
                        <p>
                            Я проинформирован(а), что обработка моих персональных данных будет осуществляться в соответствии с действующим законодательством Российской Федерации как неавтоматизированным, так и автоматизированным способами.
                        </p>
                        
                        <p>
                            Данное согласие действует до достижения целей обработки персональных данных или в течение срока хранения информации. Данное согласие может быть отозвано в любой момент по моему письменному заявлению.
                        </p>
                        
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 30,
                            paddingTop: 16,
                            borderTop: "1px dashed #ccc"
                        }}>
                            <div>
                                <div style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666", fontSize: "12px" }}>Дата согласия:</div>
                                <div style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>
                                    {new Date().toLocaleDateString('ru-RU')}
                                </div>
                            </div>
                            
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontFamily: "'DMSans-Regular', sans-serif", color: "#666", fontSize: "12px" }}>Подпись:</div>
                                <div style={{ fontFamily: "'DMSans-Medium', sans-serif" }}>{consentName}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileCard;
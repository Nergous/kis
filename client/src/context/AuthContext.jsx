import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

// Создаем контекст
const AuthContext = createContext();

// Провайдер контекста
export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);

    // Функция для извлечения данных из localStorage
    const extractUserFromToken = () => {
        const role = localStorage.getItem('role');
        if(role) return role;
        return null;
    };

    // При монтировании компонента извлекаем данные из localStorage
    useEffect(() => {
        const userData = extractUserFromToken();
        if (userData) {
            setRole(userData);
        }
    }, []);

    // Функция для входа пользователя
    const login = (token, role) => {
        Cookies.set('auth_token', token, { expires: 24 / 24 });
        localStorage.setItem('role', role);
        const userData = extractUserFromToken();
        setRole(userData);
    };

    // Функция для выхода пользователя
    const logout = () => {
        Cookies.remove('auth_token');
        localStorage.removeItem('role');
        window.location.href = '/';
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для использования контекста
export const useAuth = () => useContext(AuthContext);
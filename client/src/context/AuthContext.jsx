import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

// Создаем контекст
const AuthContext = createContext();

// Провайдер контекста
export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [name, setName] = useState(null);

    // Функция для извлечения данных из localStorage
    const extractUserFromToken = () => {
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('name');
        if (role && name) {
            return { role, name };
        }
        return null;
    };

    // При монтировании компонента извлекаем данные из localStorage
    useEffect(() => {
        const userData = extractUserFromToken();
        if (userData) {
            setRole(userData.role);
            setName(userData.name);
        }
    }, []);

    // Функция для входа пользователя
    const login = (token, role, name) => {
        Cookies.set('auth_token', token, { expires: 24 / 24 });
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        const userData = extractUserFromToken();
        setRole(userData.role);
        setName(userData.name);
    };

    // Функция для выхода пользователя
    const logout = () => {
        Cookies.remove('auth_token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        window.location.href = '/';
        setRole(null);
        setName(null);
    };

    return (
        <AuthContext.Provider value={{ role, name, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для использования контекста
export const useAuth = () => useContext(AuthContext);
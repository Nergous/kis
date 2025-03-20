import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
// import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";

// Защищенный роутер
const ProtectedProvider = ({ children, excludedRoles = [] }) => {
    const navigate = useNavigate();
    const [isloading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const { role, logout } = useAuth();

    useEffect(() => {
        setLoading(true);
        const token = Cookies.get("auth_token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!role) {
            setLoading(true);
            setIsAuth(false);
        } else {
            // Проверяем, если роль пользователя входит в список исключенных ролей
            if (excludedRoles.includes(role)) {
                navigate("/"); // Перенаправляем на главную страницу
                return;
            }
            setLoading(false);
            setIsAuth(true);
        }
        setLoading(false);
    }, [navigate, role, logout, excludedRoles]);

    if (isloading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h1>Проверка пользователя...</h1>
            </div>
        );
    }

    return isAuth ? children : null; // Рендерим children только если пользователь авторизован
};

export default ProtectedProvider;
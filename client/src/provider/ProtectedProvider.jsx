import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
// import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";

/*
   Крч, тут можно реализовать логику проверки навигации.
   Чо значит, при помощи useNavigate мы получаем путь, текущий.
   Пихаем путь в зависимость useEffect, как это уже сделано ниже.
   
   До этого формируем список путей и ролей для этих путей, и там можно проверять,
   если роль не соответствует этому пути, то редирект.
   
   Это сделать необходимо, чтобы нельзя было ручками поменять ссылку в браузере и зайти.

   /api/auth/check можно вообще убрать, оставив тока проверку наличия токена, дабы не дергать сервер.

   Доступные кнопки в сайдбаре делаются в самом сайдбаре, типо когда ты залогинен чо тебе доступно будет появляться.
   Но это делается не в этом файле.
*/

// Защищенный роутер
const ProtectedProvider = ({ children }) => {
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
            setLoading(false);
            setIsAuth(true);
        }
        setLoading(false);
    }, [navigate, role, logout]);


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

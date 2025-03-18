import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import Cookies from "js-cookie";
import { logOut } from "../utils/auth";
// import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";

{/*
   Крч, тут можно реализовать логику проверки навигации.
   Чо значит, при помощи useNavigate мы получаем путь, текущий.
   Пихаем путь в зависимость useEffect, как это уже сделано ниже.
   
   До этого формируем список путей и ролей для этих путей, и там можно проверять,
   если роль не соответствует этому пути, то редирект.
   
   Это сделать необходимо, чтобы нельзя было ручками поменять ссылку в браузере и зайти.

   /api/auth/check можно вообще убрать, оставив тока проверку наличия токена, дабы не дергать сервер.

   Доступные кнопки в сайдбаре делаются в самом сайдбаре, типо когда ты залогинен чо тебе доступно будет появляться.
   Но это делается не в этом файле.
*/}

// Защищенный роутер
const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isloading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setLoading(true);
        // console.log(location.pathname);
        const token = Cookies.get("auth_token");
        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(false);
        setIsAuth(true);
    }, [location]);


    if (isloading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h1>Проверка пользователя...</h1>
            </div>
        );
    }

    return isAuth ? children : navigate("/login"); // Рендерим children только если пользователь авторизован
};

export default ProtectedRoute;

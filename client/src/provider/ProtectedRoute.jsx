import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
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
    const [isloading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = Cookies.get("auth_token");
        if (!token) {
            navigate("/login");
            return;
        }
        const checkAuth = async () => {
            try {
                const response = await api().get("/api/auth/check");
                if (response.data.success === true) {
                    setIsAuth(true);
                } else {
                    logOut();
                    setIsAuth(false);
                }
            } catch (error) {
                console.error(
                    "Error checking auth status:",
                    error.response.data.error
                );
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);


    if (isloading) {
        return (
            // <div className="d-flex justify-content-center align-items-center vh-100">
            //     <div className="spinner-border" role="status">
            //         <span className="visually-hidden">Loading...</span>
            //     </div>
            // </div>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h1>Проверка пользователя...</h1>
                {/* <LoadingSpinner text="Проверка пользователя..." variant="info" animation="border"/> */}
            </div>
        );
    }

    return isAuth ? children : navigate("/login"); // Рендерим children только если пользователь авторизован
};

export default ProtectedRoute;

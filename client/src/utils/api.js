import axios from "axios";
import Cookies from "js-cookie";
import { logOut } from "./auth";

const url = process.env.REACT_APP_API_URL;

// Использование в будущем: импортируешь api по типу 'import api from ...'
// И далее использование, к примеру: const response = await api().get('/users')
const api = () => {
    const api = axios.create({
        baseURL: `${url}`,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    });

    // Добавляем перехватчик для добавления токена в заголовки
    api.interceptors.request.use(
        (config) => {
            const token = Cookies.get("auth_token"); // Получаем токен из кук
            // const role = localStorage.getItem("role"); // Получаем роль
            if (!!token) {
                config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок
            }
            // if(!!role) { // если роль есть, то добавляем в заголовок
            //     config.headers.role = role
            // }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(response => response, error => {
        // if (error.response.status === 401 && error.response.error == 'Unauthorized') {
        if (error.response?.status === 401) {
            logOut();

            return Promise.reject(error);
        }

        return Promise.reject(error);
    });

    return api;
}

export default api
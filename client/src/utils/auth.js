import Cookies from "js-cookie";
import cookie from "cookie";

export const isLoggedIn = (reqCookies = null) => {
    if (!reqCookies) {
        return !!Cookies.get("auth_token");
    }

    return !!cookie.parse(reqCookies).auth_token;
}

export const logIn = (token, role) => {
    Cookies.set("auth_token", token, { expires: 24 / 24 });
    localStorage.setItem("role", role);
}

export const logOut = () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
}
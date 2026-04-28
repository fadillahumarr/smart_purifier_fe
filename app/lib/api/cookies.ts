const setCookie = (name: string, value: string, maxAge = 86400) => {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const getCookie = (name: string) => {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
};

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; max-age=0`;
};

const clearAuthCookies = () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
};

export { setCookie, getCookie, deleteCookie, clearAuthCookies };
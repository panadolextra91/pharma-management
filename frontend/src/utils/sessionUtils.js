// utils/sessionUtils.js
export const getSessionData = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    return { token, role };
};

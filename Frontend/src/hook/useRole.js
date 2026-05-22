import { useSelector } from "react-redux";

export const useRole = () => {

    const user = useSelector((state) => state.auth.user);

    return {
        role: user?.role,
        isAdmin: user?.role === "ADMIN",
        isUser: user?.role === "USER",
    };
};   
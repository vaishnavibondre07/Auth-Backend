import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ allowedRoles }) => {

    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const AdminRoute = ({ children }) => {

    const { user } = useSelector((state) => state.auth);

    // If user not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If logged in but NOT admin
    if (user.role !== "admin") {
        return <Navigate to="/profile" />;
    }

    // If admin
    return children;
};  
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
    const token = useSelector((state) => state.auth.accessToken);
    if (!token) {
        // Clear any leftover tokens
        Cookies.remove(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_accessToken`);
        Cookies.remove(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_refreshToken`);

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCheckSessionQuery } from "../api/authApi";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

export const useSessionChecker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { error } = useCheckSessionQuery(undefined, {
    skip: !user,                // only poll when user is logged in
    pollingInterval: 15000,     // check every 15 seconds
    refetchOnFocus: true,       // re-check when user switches back to tab
  });

  useEffect(() => {
    if (error?.status === 401 || error?.status === 403) {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [error]);
};
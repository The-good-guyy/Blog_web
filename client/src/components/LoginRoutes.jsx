import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function LoginRoute() {
  const { currentUser } = useSelector((state) => state.user.user);
  return currentUser ? <Navigate to="/" /> : <Outlet />;
}

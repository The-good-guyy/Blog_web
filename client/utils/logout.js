import axios from "axios";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/users/userSlice";
import { logOutRoutes } from "./ApiRoutes";
import { useState } from "react";
export function LogOut() {
  const [errorMessage, setErrorMessage] = useState();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const data = await axios.get(logOutRoutes, { withCredentials: true });
      if (data.status === "fail") {
        setErrorMessage("Failed to log out");
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  return {
    errorMessage,
    handleLogout,
  };
}

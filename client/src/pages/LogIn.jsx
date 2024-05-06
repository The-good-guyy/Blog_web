import { useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Label, TextInput, Alert, Spinner } from "flowbite-react";
import { Button } from "flowbite-react";
import axios from "axios";
import { signinRoutes } from "../../utils/ApiRoutes";
import { signInSuccess } from "../../redux/users/userSlice";
import { useDispatch } from "react-redux";
import OAuth from "../components/OAuth";
import { useState } from "react";
import { useSelector } from "react-redux";
import imgIcon from "../assets/icon 1.svg";
import darkIcon from "../assets/icon 2.svg";
function LogIn() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const { theme } = useSelector((state) => state.user.theme);
  const handleValidation = () => {
    if (!email.current.value || !password.current.value) {
      setError("Please fill out all fields!");
      setLoading(false);
      return false;
    } else if (
      password.current.value.length < 8 &&
      password.current.value.length > 30
    ) {
      setLoading(false);
      setError("PasswPassword must be 8-30 characters long");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = handleValidation();
    if (!result) {
      return;
    }
    try {
      setLoading(true);
      const data = await axios.post(
        signinRoutes,
        {
          email: email.current.value.trim(),
          password: password.current.value.trim(),
        },
        { withCredentials: true }
      );
      if (data.status === "fail") {
        setError(data.message);
        setLoading(false);
        return;
      } else {
        dispatch(signInSuccess(data));
        setError(false);
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-40">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center sm:gap-3">
        {/* left */}
        <div className="flex-1 mr-8">
          <Link className="font-bold dark:text-white text-4xl" to="/">
            {theme === "dark" ? (
              <img src={imgIcon} alt="" />
            ) : (
              <img src={darkIcon} alt="" />
            )}
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your mail or Google
            account
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                ref={email}
                disabled={loading}
              ></TextInput>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                type="text"
                placeholder="Password"
                id="password"
                ref={password}
                disabled={loading}
              ></TextInput>
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Log In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {error && (
            <Alert
              className="mt-5"
              color="failure"
              onDismiss={() => setError(false)}
              hidden
            >
              {error}
            </Alert>
          )}
          {!error && (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3.5 px-4 mt-5 invisible">
              Useless Button
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogIn;

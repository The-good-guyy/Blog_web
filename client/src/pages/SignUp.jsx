import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Label, TextInput, Alert, Spinner, Checkbox } from "flowbite-react";
import { Button } from "flowbite-react";
import axios from "axios";
import { signupRoutes } from "../../utils/ApiRoutes";
function SignUp() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userName = useRef();
  const email = useRef();
  const password = useRef();
  const checked = useRef();
  const navigate = useNavigate();
  const handleValidation = () => {
    if (
      !userName.current.value ||
      !email.current.value ||
      !password.current.value
    ) {
      setErrorMessage("Please fill out all fields!");
      return false;
    } else if (userName.current.value.length < 5) {
      setErrorMessage("Username must be greater than 5 characters");
      return false;
    } else if (password.current.value.length < 8) {
      setErrorMessage("Password must be greater than 8 characters");
      return false;
    } else if (!checked.current.checked) {
      setErrorMessage("You must agree the terms and conditions");
      return false;
    } else if (password.current.value.length > 30) {
      setErrorMessage("Password must be under than 30 characters");
      return false;
    } else if (userName.current.value.length > 30) {
      setErrorMessage("Username must be under than 30 characters");
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
      setErrorMessage(null);
      setIsLoading(true);
      const data = await axios.post(
        signupRoutes,
        {
          username: userName.current.value.trim(),
          email: email.current.value.trim(),
          password: password.current.value.trim(),
        },
        { withCredentials: true }
      );
      setIsLoading(false);
      if (data.status === "fail") {
        return setErrorMessage(data.message);
      }
      navigate("/signin");
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-10 flex transparentBody">
      <div className="overlay"></div>
      <div className="overlay glitch"></div>
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center sm:gap-3">
        {/* left */}
        {/* <div className="flex-1">
          <Link className="font-bold dark:text-white text-4xl" to="/">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
              Unknown`s
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your mail or Google
            account
          </p>
        </div> */}
        {/* right */}
        <div className="flex-1 mr-8 mb-8">
          <div className="sun"></div>
        </div>
        <div className="flex-1 z-50">
          <form
            className="flex gap-4 flex-col min-w-96"
            onSubmit={handleSubmit}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                required
                ref={userName}
                disabled={isLoading}
              ></TextInput>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                type="email"
                placeholder="name@example.com"
                id="email"
                required
                ref={email}
                disabled={isLoading}
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
                required
                minLength={6}
                ref={password}
                disabled={isLoading}
              ></TextInput>
            </div>
            <div className="flex items-center gap-2 z-10">
              <Checkbox id="agree" ref={checked} />
              <Label htmlFor="agree" className="flex">
                I agree with the&nbsp;
                <Link
                  to="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  className="text-cyan-600 hover:underline dark:text-cyan-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms and conditions
                </Link>
              </Label>
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/login" className="text-blue-500">
              Log In
            </Link>
          </div>
          {errorMessage && (
            <Alert
              className="mt-5"
              color="failure"
              onDismiss={() => setErrorMessage(null)}
            >
              {errorMessage}
            </Alert>
          )}
          {!errorMessage && (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3.5 px-4 mt-5 invisible">
              Useless Button
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;

import { Button, Alert, Spinner } from "flowbite-react";
import { useRef, useState } from "react";
import { TextInput } from "flowbite-react";
import { updatePasswordRoutes } from "../../utils/ApiRoutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useInput } from "../hooks/useInpit";
import { forgotPasswordRoutes } from "../../utils/ApiRoutes";
import { useSelector } from "react-redux";
function AccountSecurity() {
  const { currentUser } = useSelector((state) => {
    return state.user.user;
  });
  const curPassword = useRef();
  const [uploadProgress, setUploadProgress] = useState(false);
  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    handleErrorDismiss: handlePasswordErrorDismiss,
    resetInput: resetPassword,
    hasError: passwordHasError,
  } = useInput("", (value) => value.length >= 8 && value.length <= 30);
  const {
    value: passwordConfirmValue,
    handleInputChange: handlePasswordConfirmChange,
    handleInputBlur: handlePasswordConfirmBlur,
    handleErrorDismiss: handlePasswordConfirmErrorDismiss,
    resetInput: resetPasswordConfirm,
    hasError: passwordConfirmHasError,
  } = useInput("", (value) => value === passwordValue);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const handleResetPassword = async () => {
    try {
      setUploadProgress(true);
      const data = await axios.post(forgotPasswordRoutes, {
        email: currentUser.email,
      });
      setUploadProgress(false);
      if (data.status === "fail") {
        toast.error("Failed to send a reset password mail", toastOptions);
      }
      toast.success("Successfully send a reset password mail", toastOptions);
    } catch (error) {
      setUploadProgress(false);
      toast.error(error.response.data.message, toastOptions);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordValue || !passwordConfirmValue || !curPassword) {
      toast.error("Please enter all field", toastOptions);
      return;
    }
    if (passwordHasError) {
      toast.error("New password must be 8-30 characters", toastOptions);
      return;
    }
    if (passwordConfirmHasError) {
      toast.error(
        "Confirm password must match your new password",
        toastOptions
      );
      return;
    }
    try {
      setUploadProgress(true);
      const data = await axios.patch(
        updatePasswordRoutes,
        {
          passwordCurrent: curPassword.current.value,
          password: passwordValue,
          passwordConfirm: passwordConfirmValue,
        },
        { withCredentials: true }
      );
      setUploadProgress(false);
      if (data.statusCode === false) {
        toast.error(data.message, toastOptions);
      } else {
        resetPassword();
        resetPasswordConfirm();
        toast.success("Successful update", toastOptions);
      }
    } catch (error) {
      setUploadProgress(false);
      toast.error(error.response.data.message, toastOptions);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="mt-4 mb-2 text-center font-semibold text-3xl">
        Account Security
      </h1>
      <p className="mb-7 text-center font-semibold text-md">
        Edit your account settings and change your password here.
      </p>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <p className="mb-3 text-gray-500 dark:text-gray-400 text-lg font-semibold">
        PASSWORD
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          id="curPassword"
          placeholder="Enter current password"
          ref={curPassword}
          required
          disabled={uploadProgress}
        />
        <TextInput
          type="text"
          id="newPassword"
          placeholder="Enter new password"
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
          value={passwordValue}
          disabled={uploadProgress}
          required
        />
        <TextInput
          type="text"
          id="newPassword"
          placeholder="Re-type new password"
          onChange={handlePasswordConfirmChange}
          onBlur={handlePasswordConfirmBlur}
          value={passwordConfirmValue}
          disabled={uploadProgress}
          required
        />
        <Button
          color="dark"
          className="group focus:ring-transparent ease-linear transition-colors p-2"
          size="xs"
          type="submit"
        >
          {uploadProgress ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            <span className=" group-hover:text-slate-200 text-sm/6">
              Change password
            </span>
          )}
        </Button>
      </form>
      {passwordHasError && (
        <Alert
          className="mt-5"
          color="failure"
          onDismiss={handlePasswordErrorDismiss}
        >
          New password must be 8-30 characters
        </Alert>
      )}
      {passwordConfirmHasError && (
        <Alert
          className="mt-5"
          color="failure"
          onDismiss={handlePasswordConfirmErrorDismiss}
        >
          Confirm password must macth new password
        </Alert>
      )}
      <p className="text-gray-500 dark:text-gray-400 mt-10">
        Forget your old password? Hit the button below so we can send email to
        reset password
      </p>
      <Button
        color="dark"
        className="group focus:ring-transparent ease-linear transition-colors p-2 mt-4"
        size="xs"
        onClick={handleResetPassword}
      >
        {uploadProgress ? (
          <>
            <Spinner size="sm" />
            <span className="pl-3">Loading...</span>
          </>
        ) : (
          <span className=" group-hover:text-slate-200 text-sm/6">
            Reset password
          </span>
        )}
      </Button>
      <ToastContainer />
    </div>
  );
}

export default AccountSecurity;

import { Button, Modal } from "flowbite-react";
import { useState, useRef } from "react";
import { IoWarningSharp } from "react-icons/io5";
import { generateId } from "../../utils/Helper";
import { TextInput } from "flowbite-react";
import { deleteUserRoutes } from "../../utils/ApiRoutes";
// import { Alert } from "flowbite-react";
import axios from "axios";
import { LogOut } from "../../utils/logout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function CloseAccount() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteToken, setDeleteToken] = useState();
  const { handleLogout } = LogOut();
  const securityInput = useRef();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const handleCloseAccount = async () => {
    setOpenDeleteModal(false);
    if (securityInput.current.value !== deleteToken) {
      toast.error("Wrong Input", toastOptions);
      return;
    }
    const data = await axios.delete(deleteUserRoutes, {
      withCredentials: true,
    });
    try {
      if (data.status === 204) {
        toast.success("Successfully close account", toastOptions);
        setTimeout(() => {
          handleLogout();
        }, "1500");
      } else {
        toast.error("Failed to close account", toastOptions);
      }
    } catch (error) {
      toast.error("Failed to close account", toastOptions);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="mt-4 mb-2 text-center font-semibold text-3xl">
        Close Account
      </h1>
      <p className="mb-7 text-center font-semibold text-md">
        Close your account permanently.
      </p>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

      <p className="mb-3 text-gray-500 dark:text-gray-400 text-lg">
        <span className="text-red-900 text-lg font-bold">Warning: </span>
        if you close this account, you will lose access to this account forever.
      </p>
      <div className="flex justify-center mt-4">
        <Button
          color="dark"
          className="group focus:ring-transparent ease-linear transition-colors p-2"
          size="xs"
          onClick={() => {
            setDeleteToken(generateId(8));
            setOpenModal(true);
          }}
        >
          <span className=" group-hover:text-slate-200 text-sm/6">
            Close Account
          </span>
        </Button>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              <IoWarningSharp className="mx-auto mb-4 h-14 w-14 text-red-700" />
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  setOpenDeleteModal(true);
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              <IoWarningSharp className="mx-auto mb-4 h-14 w-14 text-red-700" />
              To delete users, type the text to confirm.
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {deleteToken}
            </p>
            <TextInput
              type="text"
              id="security"
              placeholder="Type here"
              ref={securityInput}
              className="mb-5"
            />
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleCloseAccount}>
                Delete
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default CloseAccount;

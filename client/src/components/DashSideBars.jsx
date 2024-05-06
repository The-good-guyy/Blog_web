import { Sidebar, Badge } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiChartPie } from "react-icons/hi";
import { TiUserDelete } from "react-icons/ti";
import { PiPasswordBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { LogOut } from "../../utils/logout";
import { PiUsersThreeFill } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlinePostAdd } from "react-icons/md";
import { useState } from "react";
function DashSideBars({ tab }) {
  const { errorMessage: logOutErrorMessage, handleLogout } = LogOut();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [sidebarCTA, setSidebarCTA] = useState(true);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              label={"User"}
              labelColor="dark"
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab === "users"}
              icon={PiUsersThreeFill}
              labelColor="dark"
              as="div"
            >
              Users
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=close-account">
            <Sidebar.Item
              active={tab === "close-account"}
              icon={TiUserDelete}
              labelColor="dark"
              as="div"
            >
              Close Account
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=post">
            <Sidebar.Item
              active={tab === "post"}
              icon={MdOutlinePostAdd}
              labelColor="dark"
              as="div"
            >
              Posts
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=account-security">
            <Sidebar.Item
              active={tab === "account-security"}
              icon={PiPasswordBold}
              labelColor="dark"
              as="div"
            >
              Account Security
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={() => {
              handleLogout();
              if (logOutErrorMessage) {
                toast.error(logOutErrorMessage, toastOptions);
              }
            }}
          >
            Log Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
      {sidebarCTA && (
        <Sidebar.CTA>
          <div className="mb-3 flex items-center">
            <Badge color="warning">Demo</Badge>
            <button
              aria-label="Close"
              className="-m-1.5 ml-auto inline-flex h-6 w-6 rounded-lg bg-gray-100 p-1 text-cyan-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
              type="button"
              onClick={() => setSidebarCTA(false)}
            >
              <svg
                aria-hidden
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="mb-3 text-sm text-cyan-900 dark:text-gray-400">
            Preview the blog app demo! You can do many thing at the site
            including creating post, etc. Try out!
          </div>
          {/* <a
          className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300"
          href="#"
        >
          Turn new navigation off
        </a> */}
        </Sidebar.CTA>
      )}
      <ToastContainer />
    </Sidebar>
  );
}

export default DashSideBars;

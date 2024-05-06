import { Avatar, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { LogOut } from "../../utils/logout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imgIcon from "../assets/logo-no-background.svg";
import { useEffect, useState } from "react";
import darkIcon from "../assets/overload-high-resolution-logo-black-transparent.svg";
function Header() {
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const location = useLocation();
  const { currentUser } = useSelector((state) => {
    return state.user.user;
  });
  const navigate = useNavigate();
  const { errorMessage: logOutErrorMessage, handleLogout } = LogOut();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBar, setSearchBar] = useState(false);
  const { theme } = useSelector((state) => state.user.theme);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    setSearchBar(false);
    navigate(`/search?${searchQuery}`);
  };
  return (
    <Navbar className="border-b-2 relative">
      {!searchBar && (
        <>
          {" "}
          <Link
            className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white max-w-14"
            to="/"
            alt="overload"
          >
            {theme === "dark" ? (
              <img className="" src={imgIcon} alt="" />
            ) : (
              <img className="" src={darkIcon} alt="" />
            )}
          </Link>
          <form action="" className="" onSubmit={handleSubmit}>
            <TextInput
              type="text"
              placeholder="Search..."
              rightIcon={AiOutlineSearch}
              className="md:inline hidden"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></TextInput>
          </form>
          <Button
            className="w-12 h-10 md:hidden"
            color="gray"
            pill
            onClick={() => setSearchBar(true)}
          >
            <AiOutlineSearch></AiOutlineSearch>
          </Button>
          <div className="flex gap-2 md:order-2">
            <Button
              className="w-12 h-10 sm:inline"
              color="gray"
              pill
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <FaMoon></FaMoon> : <FaSun></FaSun>}
            </Button>
            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="user"
                    img={currentUser.profilePicture}
                    rounded
                    referrerPolicy="no-referrer"
                  ></Avatar>
                }
              >
                <Dropdown.Header>
                  <div className="flex mb-4">
                    <Avatar
                      alt="user"
                      img={currentUser.profilePicture}
                      rounded
                      className="ml-2"
                      size="md"
                      referrerPolicy="no-referrer"
                    >
                      <div className="space-y-1 font-medium dark:text-white">
                        <div>{currentUser.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {currentUser.email}
                        </div>
                      </div>
                    </Avatar>
                  </div>
                  <Dropdown.Divider></Dropdown.Divider>
                  <Link to="/dashboard?tab=profile">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </Link>
                  {/* <Dropdown.Divider></Dropdown.Divider> */}
                  <Dropdown.Item
                    onClick={() => {
                      handleLogout();
                      if (logOutErrorMessage) {
                        toast.error(logOutErrorMessage, toastOptions);
                      }
                    }}
                  >
                    Log out
                  </Dropdown.Item>
                </Dropdown.Header>
              </Dropdown>
            ) : (
              <Link to="/login">
                <Button gradientDuoTone="purpleToBlue" pill outline>
                  Log In
                </Button>
              </Link>
            )}
            <Navbar.Toggle></Navbar.Toggle>
          </div>
          <Navbar.Collapse>
            <Navbar.Link active={path === "/"} as={"div"}>
              <Link to="/">Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as={"div"}>
              <Link to="/about">About</Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/dashboard"} as={"div"}>
              <Link to="/dashboard">Projects</Link>
            </Navbar.Link>
          </Navbar.Collapse>
        </>
      )}

      {searchBar && (
        <div
          tabIndex="-1"
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-40 justify-center items-center w-full bottom-0 bg-[rgba(0,0,0,0.3)]"
          onClick={() => setSearchBar(false)}
        ></div>
      )}
      {searchBar && (
        <form
          className="w-[90%] mx-auto left-0 right-0 z-50 transition-all"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
      )}
      <ToastContainer />
    </Navbar>
  );
}

export default Header;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import PrivateRoutes from "./components/PrivateRoutes";
import AdminPrivateRoute from "./components/AdminPrivateRoutes";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import LoginRoute from "./components/LoginRoutes";
import Search from "./components/Search";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import { useEffect } from "react";
// import { fecthUserRoutes } from "../utils/ApiRoutes";
// import { fetchUser } from "../redux/users/userSlice";
// import { getCookie } from "../utils/Helper";
function App() {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   async function fecthUserData() {
  //     try {
  //       if (getCookie("second_token")) {
  //         const user = await axios.get(fecthUserRoutes, {
  //           withCredentials: true,
  //         });
  //         if (user) {
  //           dispatch(fetchUser(user));
  //         }
  //       }
  //     } catch (error) {
  //       return;
  //     }
  //   }
  //   fecthUserData();
  // }, []);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route element={<LoginRoute />}>
          <Route path="/login" element={<LogIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Route>
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route element={<AdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />}></Route>
            <Route path="/update-post/:postId" element={<UpdatePost />}></Route>
          </Route>
        </Route>
        <Route path="/post/:postId" element={<PostPage />}></Route>
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

export default App;

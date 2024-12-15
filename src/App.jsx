import { Route, Routes } from "react-router";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";

import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { changeScrollDirection } from "./store/scrollDirection/scrollDirectionSlice";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { getNewAccessToken } from "./store/auth/authThunks";
import { setUser } from "./store/auth/authSlice";
import Profile from "./components/Profile/Profile";
import Error404 from "./components/Error404/Error404";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import DeleteAccount from "./components/DeleteAccount/DeleteAccount";
import ResetPassword from "./components/ResetPassword/ResetPassword";

const App = () => {
  const { scrollY } = useScroll();
  const dispatch = useDispatch();
  const { scrollDirection } = useSelector((state) => state.scrollDirection);
  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - scrollY.getPrevious();
    if (scrollDirection == "up" && diff > 0) {
      dispatch(changeScrollDirection({ scrollDirection: "down" }));
    } else if (scrollDirection == "down" && diff < 0) {
      dispatch(changeScrollDirection({ scrollDirection: "up" }));
    }
  });

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(getNewAccessToken());
      dispatch(setUser(storedUser));
    }
    localStorage.removeItem("user");
  }, [dispatch]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return (
    <motion.div className="relative">
      <Navbar />
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
        <Route path="/resetPassword/:token" element={<ResetPassword />}></Route>
        {(!user || !user.isVerified) && (
          <>
            <Route path="/verify-email" element={<VerifyEmail />}></Route>
          </>
        )}

        {isAuthenticated && (
          <>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/deleteAccount" element={<DeleteAccount />}></Route>
          </>
        )}

        <Route path="*" element={<Error404 />}></Route>
      </Routes>
    </motion.div>
  );
};

export default App;

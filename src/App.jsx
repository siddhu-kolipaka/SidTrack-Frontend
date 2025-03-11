import { Route, Routes } from "react-router";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Navbar from "./components/Navbar/Navbar";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";

import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { getNewAccessToken } from "./store/auth/authThunks";
import { setUser } from "./store/auth/authSlice";
import Profile from "./pages/Profile/Profile";
import Error404 from "./pages/Error404/Error404";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import TransactionLog from "./components/TransactionLog/TransactionLog";
import Portfolio from "./pages/Portfolio/Portfolio";
import Tracker from "./pages/Tracker/Tracker";
import Loading from "./pages/Loading/Loading";
import InvestmentCalc from "./pages/InvestmentCalc/InvestmentCalc";
import About from "./pages/About/About";
import PnL from "./pages/PnL/PnL";
import { useScrollDirection } from "./utils/useScrollDirection";

const App = () => {
  useScrollDirection();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Persistant login
  //rehydrate
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(getNewAccessToken()).then(() => {});
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  return (
    <motion.div className="relative w-full">
      <Navbar />
      <Routes>
        <Route index element={<About />}></Route>

        {!user?.isVerified && (
          <Route path="/verifyEmail" element={<VerifyEmail />}></Route>
        )}

        {isAuthenticated ? (
          <>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/deleteAccount" element={<DeleteAccount />}></Route>
            <Route path="/transactionLog" element={<TransactionLog />}></Route>
            <Route path="/PnL" element={<PnL />}></Route>
            <Route path="/tracker" element={<Tracker />}></Route>
            <Route path="/portfolio" element={<Portfolio />}></Route>
            <Route path="/calc" element={<InvestmentCalc />}></Route>
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
            <Route
              path="/resetPassword/:token"
              element={<ResetPassword />}
            ></Route>
            <Route path="/loading" element={<Loading />}></Route>
          </>
        )}

        <Route path="*" element={<Error404 />}></Route>
      </Routes>
    </motion.div>
  );
};

export default App;

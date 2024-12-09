import { Route, Routes } from "react-router";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { changeScrollDirection } from "./store/scrollDirection/scrollDirectionSlice";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { scrollY } = useScroll();
  const dispatch = useDispatch();
  const scrollDirection = useSelector((state) => state.scrollDirection);
  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - scrollY.getPrevious();
    if (scrollDirection == "up" && diff > 0) {
      dispatch(changeScrollDirection({ scrollDirection: "down" }));
    } else if (scrollDirection == "down" && diff < 0) {
      dispatch(changeScrollDirection({ scrollDirection: "up" }));
    }
  });

  return (
    <motion.div className="relative">
      <Navbar />
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </motion.div>
  );
};

export default App;

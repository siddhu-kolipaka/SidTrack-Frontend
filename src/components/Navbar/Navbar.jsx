import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/auth/authThunks";

const Navbar = () => {
  return (
    <div className="flex justify-center">
      <SlideTabs />
    </div>
  );
};
export default Navbar;

const SlideTabs = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const ref = useRef(null);
  const buttonRef = useRef(null);

  const { scrollDirection } = useSelector((state) => state.scrollDirection);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setPosition({ left: 0, width: 0, opacity: 0 });
  }, [isAuthenticated]);

  return (
    <AnimatePresence>
      {scrollDirection === "up" && (
        <motion.ul
          initial={{ y: -75 }}
          animate={{ y: 10 }}
          exit={{ y: -75 }}
          transition={{ duration: 0.5 }}
          onMouseLeave={() => {
            setPosition((pv) => ({
              ...pv,
              opacity: 0,
            }));
          }}
          className=" fixed z-50 flex justify-evenly items-center w-fit h-14 md:h-16 rounded-full bg-pri  p-2 md:p-2 border-2 border-bord"
        >
          <Tab to="/" setPosition={setPosition}>
            Home
          </Tab>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                ref={ref}
                onMouseEnter={() => {
                  if (!ref?.current) return;

                  const { width } = ref.current.getBoundingClientRect();

                  setPosition({
                    left: ref.current.offsetLeft,
                    width,
                    opacity: 1,
                  });
                }}
                className={`relative z-10 cursor-pointer flex gap-1 px-3 items-center md:p-2 w-fit text-sm font-medium text-pri ${
                  location.pathname === "/profile" &&
                  "underline underline-offset-4"
                }  uppercase mix-blend-difference md:text-base `}
              >
                <img
                  src="https://api.dicebear.com/9.x/thumbs/svg"
                  alt="avatar"
                  className=" size-6 md:size-7 rounded-full"
                />
                <div className="pr-1">Profile</div>
              </Link>

              <button
                ref={buttonRef}
                onMouseEnter={() => {
                  if (!buttonRef?.current) return;

                  const { width } = buttonRef.current.getBoundingClientRect();

                  setPosition({
                    left: buttonRef.current.offsetLeft,
                    width,
                    opacity: 1,
                  });
                }}
                className={`relative z-10 cursor-pointer  w-fit px-3 text-sm font-medium text-pri uppercase mix-blend-difference md:px-5 md:py-3 md:text-base `}
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Tab to="/signup" setPosition={setPosition}>
                Sign up
              </Tab>
              <Tab to="/login" setPosition={setPosition}>
                Log in
              </Tab>
            </>
          )}
          <Cursor position={position} />
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

const Tab = ({ children, setPosition, to }) => {
  const ref = useRef(null);
  const location = useLocation();
  return (
    <Link
      to={`${to}`}
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className={`relative z-10 block cursor-pointer px-3 text-sm font-medium text-pri ${
        location.pathname === to && "underline underline-offset-4"
      }  uppercase mix-blend-difference md:px-5 md:py-3 md:text-base `}
    >
      {children}
    </Link>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-10 md:h-12 rounded-full bg-back"
    />
  );
};

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { useSelector } from "react-redux";

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

  const { scrollDirection } = useSelector((state) => state.scrollDirection);
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
          className=" mx-auto fixed z-50 flex w-fit rounded-full bg-pri p-1 border-2 border-border"
        >
          <Tab to="/" setPosition={setPosition}>
            Home
          </Tab>
          <Tab to="/signup" setPosition={setPosition}>
            Sign up
          </Tab>
          <Tab to="/login" setPosition={setPosition}>
            Log in
          </Tab>
          <Cursor position={position} />
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

const Tab = ({ children, setPosition, to }) => {
  const ref = useRef(null);
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
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs font-medium text-pri uppercase mix-blend-difference md:px-5 md:py-3 md:text-base"
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
      className="absolute z-0 h-7 rounded-full bg-back md:h-12"
    />
  );
};

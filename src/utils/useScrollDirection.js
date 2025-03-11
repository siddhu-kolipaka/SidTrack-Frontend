import { useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useDispatch } from "react-redux";
import { changeScrollDirection } from "@/store/scrollDirection/scrollDirectionSlice";

export const useScrollDirection = () => {
  const dispatch = useDispatch();
  const { scrollY } = useScroll();
  const oldDirectionRef = useRef("up");

  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - scrollY.getPrevious();
    if (diff > 0 && oldDirectionRef.current === "up") {
      oldDirectionRef.current = "down";
      dispatch(changeScrollDirection({ scrollDirection: "down" }));
    } else if (diff < 0 && oldDirectionRef.current === "down") {
      oldDirectionRef.current = "up";
      dispatch(changeScrollDirection({ scrollDirection: "up" }));
    }
  });
};

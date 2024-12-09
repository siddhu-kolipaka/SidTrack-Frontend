import { motion } from "motion/react";
import { useState } from "react";

const Input = ({ color1, color2, duration = 2, children, className = "" }) => {
  const [interactionState, setInteractionState] = useState(null);
  const [focus, setFocus] = useState(false);

  return (
    <motion.div
      initial={{
        background: `linear-gradient(150deg, ${color1} 0% 35%, ${color2} 45% 55%, ${color1} 65% 100%)`,
      }}
      animate={
        interactionState === "play" || focus
          ? {
              background: `linear-gradient(330deg, ${color1} 0% 35%, ${color2} 45% 55%, ${color1} 65% 100%)`,
              transition: {
                duration,
                repeat: Infinity,
                ease: "linear",
              },
            }
          : undefined
      }
      onMouseMove={() => setInteractionState("play")}
      onMouseLeave={() => {
        setInteractionState(null);
      }}
      className={`p-[3px] rounded-full flex justify-center items-center ${className}`}
    >
      <div
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
};

export default Input;

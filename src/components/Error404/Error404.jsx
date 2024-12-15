import { motion } from "motion/react";

const Error404 = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className="w-[100dvw] h-[100dvh] bg-back text-txt flex flex-col justify-center items-center text-6xl"
    >
      Error 404
      <div className="text-xl">Page does not exist</div>
    </motion.div>
  );
};

export default Error404;

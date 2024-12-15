import { motion } from "motion/react";
import { useNavigate } from "react-router";

const Profile = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-[100dvh] text-txt bg-back flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="py-2 px-6 bg-green-700 rounded-xl font-medium md:text-xl md:py-4 md:px-8"
            onClick={() => {
              navigate("/forgotPassword");
            }}
          >
            Reset Password
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="py-2 px-6 bg-red-700 rounded-xl font-medium md:text-xl md:py-4 md:px-8"
            onClick={() => {
              navigate("/deleteAccount");
            }}
          >
            Delete Account
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

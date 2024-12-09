import { useState } from "react";
import Input from "../Input/Input";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signup } from "../../store/auth/authThunks";
import { useDispatch, useSelector } from "react-redux";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const validatePassword = (pass, confirmPass) => {
    if (!pass || !confirmPass) {
      setErrorMessage("Password fields cannot be empty.");
    } else if (pass !== confirmPass) {
      setErrorMessage("Passwords do not match.");
    } else if (pass.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
    } else {
      setErrorMessage("Passwords matched");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      return false;
    }
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      return;
    }
    setErrorMessage("");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validatePassword(password, value);
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (errorMessage && errorMessage !== "Passwords matched") {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const result = await dispatch(signup({ email, username, password }));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(result.payload.message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const errorMsg = result.payload || "Signup failed";
        toast.error(errorMsg);
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen bg-back flex items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="sm:w-fit"
      />
      <Input
        color1="black"
        color2="#7f5af0"
        duration={5}
        className="p-2 rounded-xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="rounded-xl sm:w-[50dvw] flex flex-col sm:flex-row sm:justify-between p-8 bg-back shadow-lg"
        >
          <div className="text-2xl text-heading font-bold uppercase text-center mb-4">
            Sign up
          </div>
          <form
            className="flex flex-col gap-4 w-[60dvw] sm:w-1/2"
            onSubmit={handleSubmitSignup}
          >
            <Input color1="black" color2="#7f5af0" className="rounded-xl p-1">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
              />
            </Input>
            <Input color1="black" color2="#7f5af0" className="rounded-xl p-1">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
              />
            </Input>
            <Input color1="black" color2="#7f5af0" className="rounded-xl p-1">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
              />
            </Input>
            <Input color1="black" color2="#7f5af0" className="rounded-xl p-1">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="rounded-xl focus:outline-none h-12 text-txt px-4 bg-back w-full"
              />
            </Input>
            {errorMessage && (
              <div
                className={`${
                  errorMessage === "Passwords matched"
                    ? "text-green-600"
                    : "text-red-600"
                } text-sm text-center`}
              >
                {errorMessage}
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="rounded-xl bg-pri w-full h-12"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign up"}
            </motion.button>
          </form>
        </motion.div>
      </Input>
    </div>
  );
};

export default Signup;

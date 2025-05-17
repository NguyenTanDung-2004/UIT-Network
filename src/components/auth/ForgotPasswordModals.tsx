import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

interface ModalProps {
  onClose: () => void;
  onNext?: () => void;
}

// Modal 1: for entering email
const EnterEmailModal: React.FC<ModalProps> = ({ onClose, onNext }) => {
  const [email, setEmail] = useState("");

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-[#b0afaf] bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center mb-8">
          <Image
            src="/icon.ico"
            alt="Study Buddy Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h2 className="text-2xl font-bold text-gray-700 mt-2">
            Forgot Password
          </h2>
        </div>

        <form>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2 uppercase text-sm"
            >
              EMAIL
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                className="border border-gray-200 rounded-md w-full py-3 pl-10 pr-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-pink-300"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={onNext}
            className="bg-primary hover:bg-opacity-80 text-white font-medium py-3 px-4 rounded-md w-full transition duration-200"
            type="button"
          >
            Next
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Modal 2: for entering verification code
const EnterCodeModal: React.FC<ModalProps> = ({ onClose, onNext }) => {
  const [code, setCode] = useState("");

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-[#b0afaf] bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center mb-8">
          <Image
            src="/icon.ico"
            alt="Study Buddy Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h2 className="text-2xl font-bold text-gray-700 mt-2">
            Enter Verification Code
          </h2>
        </div>

        <form>
          <div className="mb-6">
            <label
              htmlFor="code"
              className="block text-gray-700 font-medium mb-2 uppercase text-sm"
            >
              VERIFICATION CODE
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v1H5a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 5V6a2 2 0 114 0v1H8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="code"
                className="border border-gray-200 rounded-md w-full py-3 pl-10 pr-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-pink-300"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={onNext}
            className="bg-[#FF70D9] hover:bg-opacity-80 text-white font-medium py-3 px-4 rounded-md w-full transition duration-200"
            type="button"
          >
            Verify
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Modal 3: for entering new password
const NewPasswordModal: React.FC<ModalProps> = ({ onClose, onNext }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-[#b0afaf] bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center mb-8">
          <Image
            src="/icon.ico"
            alt="Study Buddy Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h2 className="text-2xl font-bold text-gray-700 mt-2">
            Set New Password
          </h2>
        </div>

        <form>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2 uppercase text-sm"
            >
              NEW PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="border border-gray-200 rounded-md w-full py-3 pl-10 pr-10 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-pink-300"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye text-gray-400"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash text-gray-400"></i>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onNext}
            className="bg-[#FF70D9] hover:bg-opacity-80 text-white font-medium py-3 px-4 rounded-md w-full transition duration-200"
            type="button"
          >
            Save Password
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Modal4: for success message
const SuccessModal: React.FC<ModalProps> = ({ onClose }) => {
  const router = useRouter();

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-[#b0afaf] bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center mb-8">
          <Image
            src="/icon.ico"
            alt="Study Buddy Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h2 className="text-2xl font-bold text-gray-700 mt-2">
            Password Reset Successful
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
        </div>

        <button
          onClick={onClose}
          className="bg-[#FF70D9] hover:bg-opacity-80 text-white font-medium py-3 px-4 rounded-md w-full transition duration-200"
          type="button"
        >
          Back to Login
        </button>
      </motion.div>
    </motion.div>
  );
};

const ForgotPasswordModals: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [currentModal, setCurrentModal] = useState(1);

  const handleNext = () => {
    setCurrentModal((prev) => prev + 1);
  };

  return (
    <>
      {currentModal === 1 && (
        <EnterEmailModal onClose={onClose} onNext={handleNext} />
      )}
      {currentModal === 2 && (
        <EnterCodeModal onClose={onClose} onNext={handleNext} />
      )}
      {currentModal === 3 && (
        <NewPasswordModal onClose={onClose} onNext={handleNext} />
      )}
      {currentModal === 4 && <SuccessModal onClose={onClose} />}
    </>
  );
};

export default ForgotPasswordModals;

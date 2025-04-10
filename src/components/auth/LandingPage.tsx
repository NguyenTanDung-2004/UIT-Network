"use client";
import React, { useState } from "react";
import LoginModal from "./LoginModal";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8FD] relative overflow-hidden ">
      {/* Decorative Shapes */}
      <div className="absolute -bottom-[35%] -left-[20px] w-1/3 h-48 transform rotate-[110deg]">
        <Image
          src="/auth/vector.png"
          alt="Vector Shape"
          width={500}
          height={300}
          layout="responsive"
          objectFit="cover"
        />
      </div>

      <div className="absolute -top-[23%] -right-[200px] w-1/4 h-64 ">
        <Image
          src="/auth/vector.png"
          alt="Vector Shape"
          width={500}
          height={300}
          layout="responsive"
          objectFit="cover"
        />
      </div>
      {/* Header */}
      <header className="relative z-10 pt-10 px-8 md:px-16 lg:px-32 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/icon.ico"
            alt="Study Buddy Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <Image
            src="/auth/logo text.png"
            alt="Study Buddy Logo"
            width={200}
            height={200}
            className="mr-2 hidden md:block"
          />
        </div>
        <nav className="hidden md:flex items-center gap-10 font-semibold">
          <a href="#" className="text-[#101828] hover:text-opacity-80  ">
            Home
          </a>
          <a href="#" className="text-[#838383] hover:text-opacity-80">
            About
          </a>
          <a
            href="#"
            className="text-[#838383] hover:text-opacity-80 mr-[360px] md:mr-[120px] "
          >
            Contact
          </a>
          <button
            onClick={openLoginModal}
            className="text-[#101828] hover:text-opacity-80 font-semibold"
          >
            Login
          </button>
        </nav>
        <div className="md:hidden">
          <button
            onClick={openLoginModal}
            className="text-[#101828] hover:text-opacity-80 font-semibold"
          >
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 md:px-16 lg:px-32 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1D2939] mb-4 leading-tight mt-10 md:leading-relaxed lg:leading-snug">
            Study Together <br /> Succeed Together
          </h1>
          <p className="text-gray-600 mb-8">
            Find classmates, form study groups, and achieve your academic goals.
            Join our platform today!
          </p>
          <button
            onClick={openLoginModal}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-12 rounded-tl-full rounded-bl-full rounded-br-full "
          >
            Join Now
          </button>
        </div>

        <div>
          <Image
            src="/auth/bg-phone.png"
            alt="Study Illustration"
            width={500} // Adjust as needed
            height={500} // Adjust as needed
            layout="responsive"
          />
        </div>
      </main>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;

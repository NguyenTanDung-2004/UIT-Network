import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NavBarProps {
  user: {
    name: string;
    avatar: string;
  };
}

const NavBar: React.FC<NavBarProps> = ({ user }) => {
  return (
    <div className="flex items-center justify-between px-10 py-2.5 bg-white border-b">
      {/* Logo */}
      <Link href="/" className="flex items-center">
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
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full py-2 pl-11 pr-5 bg-[#f3f3f3] rounded-3xl focus:outline-none text-[#838383]"
          />
          <i className="fas fa-search absolute left-4 top-3 text-[#838383]"></i>
        </div>
      </div>

      {/* Notification, Messages and Profile */}
      <div className="flex items-center">
        <div className="relative mx-2 mr-3.5">
          <Link href="/messages">
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hover:fill-primary  transition-all duration-200 cursor-pointer"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              1
            </span>
          </Link>
        </div>
        <div className="relative mx-2 mr-4">
          <Link href="/notifications">
            <i className="fas fa-bell text-xl text-gray-600 hover:text-gray-900"></i>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              1
            </span>
          </Link>
        </div>
        <div className="ml-4">
          <Link href="/profile">
            <div className="flex items-center">
              <span className=" font-medium hidden md:block mr-3">
                {user.name}
              </span>
              <div className="w-10 h-10 relative rounded-full overflow-hidden border ">
                <Image
                  src={
                    user.avatar ||
                    "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
                  }
                  alt="user.name"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

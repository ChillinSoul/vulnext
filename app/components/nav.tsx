import React from "react";
import Link from "next/link";
const Nav = () => {
  return (
    <div className="flex w-full  items-center justify-between p-4 bg-white shadow-md rounded-b-lg fixed top-0">
      <h2 className="text-xl font-bold text-gray-700">Vulnerable App</h2>
      <div className="flex space-x-4">
        <Link
          href="/protected"
          className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200"
        >
          Protected
        </Link>
        <Link
          href="/"
          className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200"
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default Nav;

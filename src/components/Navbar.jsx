import React from 'react';
import { FaSearch } from 'react-icons/fa';
import flag from '../assets/flag-india.png';

const Navbar = () => {
return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] rounded-2xl bg-black/15 backdrop-blur-md shadow-md px-6 md:px-10 py-3 flex justify-between items-center text-white">
    <div className="text-xl font-bold tracking-wide">NEO CRICKET</div>

    <ul className="hidden md:flex gap-6 text-sm font-medium">
        {['News', 'Players', 'Schedule', 'Tickets', 'Shop', 'About'].map((item) => (
        <li
            key={item}
            className="cursor-pointer transition duration-200 hover:text-gray-300 hover:underline hover:underline-offset-4"
        >
            {item}
        </li>
        ))}
    </ul>

    <div className="flex items-center gap-4">
        <FaSearch className="text-white text-lg cursor-pointer hover:text-gray-300" />
        <button className="bg-white text-black font-semibold px-4 py-1.5 rounded-full hover:bg-gray-100 transition">
        Login
        </button>
        <img src={flag} alt="flag" className="w-10 h-10 rounded-full object-cover" />
    </div>
    </nav>
);
};

export default Navbar;

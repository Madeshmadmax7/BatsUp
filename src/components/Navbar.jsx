import React from 'react';
import { FaSearch } from 'react-icons/fa';
import flag from '../assets/flag-india.png';
import logo2 from '../assets/logo-2.png';

const Navbar = () => {
const navItemClasses = `
    relative text-white cursor-pointer px-1
    before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-gradient-to-r before:from-white before:to-white before:top-[-6px] before:left-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 
    after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:to-white after:bottom-[-6px] after:left-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 
    hover:before:scale-x-100 hover:after:scale-x-100
`;

return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] rounded-2xl bg-black/15 backdrop-blur-md shadow-md px-6 md:px-10 py-3 flex justify-between items-center text-white">
    <img src={logo2} alt="NEO CRICKET" className="h-12 w-auto object-contain" />

    <ul className="hidden md:flex gap-6 text-sm font-medium">
        {['News', 'Players', 'Schedule', 'Tickets', 'Shop', 'About'].map((item) => (
        <li key={item} className={navItemClasses}>
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

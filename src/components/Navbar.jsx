import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import flag from '../assets/flag-india.png';
import logo2 from '../assets/logo-2.png';

const Navbar = () => {
const navItemClasses = `
    relative text-white cursor-pointer px-1
    before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-white before:top-[-6px] before:left-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 
    after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-white after:bottom-[-6px] after:left-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 
    hover:before:scale-x-100 hover:after:scale-x-100
`;

const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Tournaments', to: '/tournaments' },
    { name: 'Fixtures', to: '/fixtures' },
    { name: 'About', to: '/about' },
];

return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] rounded-2xl bg-black/30 shadow-none px-6 md:px-10 py-3 flex justify-between items-center text-white">
    <img src={logo2} alt="NEO CRICKET" className="h-12 w-auto object-contain filter-none shadow-none outline-none" />

    <ul className="hidden md:flex gap-6 text-sm font-medium">
        {navLinks.map(({ name, to }) => (
        <li key={name} className={navItemClasses}>
            <Link to={to} className="focus:outline-none focus:ring-0">{name}</Link>
        </li>
        ))}
    </ul>

    <div className="flex items-center gap-4">
        <FaSearch className="text-white text-lg cursor-pointer hover:text-gray-300 focus:outline-none focus:ring-0 filter-none" />

        <button className="bg-white text-black font-semibold px-4 py-1.5 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-0 shadow-none">
        Login
        </button>

        <img
        src={flag}
        alt="flag"
        className="w-10 h-10 rounded-full object-cover shadow-none ring-0 outline-none filter-none"
        />
    </div>
    </nav>
);
};

export default Navbar;

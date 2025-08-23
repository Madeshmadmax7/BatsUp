import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import flag from "../assets/flag-india.png";
import logo2 from "../assets/logo-2.png";
import { useState } from "react";
import { useAuth } from "../AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const { user, logout } = useAuth();
    const role = user?.role;

    const navItemClasses = `
    relative text-white cursor-pointer px-1
    before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-white before:top-[-6px] before:left-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 
    after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-white after:bottom-[-6px] after:left-0 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 
    hover:before:scale-x-100 hover:after:scale-x-100
    `;

    const navLinksForPlayer = [
        { name: "Home", to: "/" },
        { name: "Tournaments", to: "/tournaments" },
        { name: "Fixtures", to: "/fixtures" },
        { name: "Scores", to: "/scores" },
        { name: "Leaderboard", to: "/leaderboard" },
        { name: "Registered", to: "/registeredTournaments" },
        { name: "About", to: "/about" },
    ];
    
    const navLinksForFan = [
        { name: "Home", to: "/" },
        { name: "Teams", to: "/teams" },
        { name: "Newsletter", to: "/newsletter" },
        { name: "Matches", to: "/matches" },
        { name: "Leaderboard", to: "/leaderboard" },
        { name: "Scores", to: "/scores" },
        { name: "About", to: "/about" },
    ];
    
    const navLinksForUser = [
        { name: "Home", to: "/" },
        { name: "Tournaments", to: "/tournaments" },
        { name: "Scores", to: "/scores" },
        { name: "Leaderboard", to: "/leaderboard" },
        { name: "Newsletter", to: "/newsletter" },
        { name: "About", to: "/about" },
    ];
    
    const navLinksForAdmin = [
        { name: "Home", to: "/" },
        { name: "Tournaments", to: "/tournaments" },
        { name: "Scores", to: "/scores" },
        { name: "Leaderboard", to: "/leaderboard" },
        { name: "Fixtures", to: "/fixtures" },
        { name: "Newsletter", to: "/newsletter" },
        { name: "Manage", to: "/manage" },
        { name: "About", to: "/about" },
    ];

    let navLinks;
    if (role === "PLAYER") navLinks = navLinksForPlayer;
    else if (role === "FAN") navLinks = navLinksForFan;
    else if (role === "ADMIN") navLinks = navLinksForAdmin;
    else navLinks = navLinksForUser;

    return (
        <>
            <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] rounded-2xl bg-black/30 px-6 md:px-10 py-3 flex justify-between items-center text-white">
                <img
                    src={logo2}
                    alt="NEO CRICKET"
                    className="h-12 w-auto object-contain cursor-pointer md:cursor-default"
                    onClick={() => {
                        if (window.innerWidth < 768) {
                            setMenuOpen(true);
                        }
                    }}
                />

                <ul className="hidden md:flex gap-6 text-sm font-medium">
                    {navLinks.map(({ name, to }) => (
                        <li key={name} className={navItemClasses}>
                            <Link to={to} className="focus:outline-none">
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-4">
                    <FaSearch className="text-white text-lg cursor-pointer hover:text-gray-300" />

                    {role ? (
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white font-semibold px-4 py-1.5 rounded-full hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-white text-black font-semibold px-4 py-1.5 rounded-full hover:bg-gray-100 transition"
                        >
                            Login
                        </button>
                    )}

                    <img
                        src={flag}
                        alt="flag"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
            </nav>

            <div
                className={`fixed top-0 left-0 h-full w-64 bg-black/90 z-[999] transform transition-transform duration-300 md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <img src={logo2} alt="Logo" className="h-10" />
                    <button
                        className="text-white text-2xl"
                        onClick={() => setMenuOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <ul className="flex flex-col gap-6 p-6 text-white">
                    {navLinks.map(({ name, to }) => (
                        <li key={name}>
                            <Link
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className="text-lg font-medium hover:text-gray-300"
                            >
                                {name}
                            </Link>
                        </li>
                    ))}

                    <li>
                        {role ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                }}
                                className="w-full bg-red-500 py-2 rounded-lg hover:bg-red-600"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    navigate("/login");
                                    setMenuOpen(false);
                                }}
                                className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-100"
                            >
                                Login
                            </button>
                        )}
                    </li>
                </ul>
            </div>

            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[998] md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;

import React from 'react';
import Navbar from './Navbar';
import hero from '../assets/hero.jpg';

const Header = () => {
return (
    <header
    className="relative w-screen h-screen bg-cover bg-center"
    style={{ backgroundImage: `url(${hero})` }}
    >
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent z-0" />

    {/* Optional: base dark overlay */}
    <div className="absolute inset-0 bg-black/25 z-0" />

    {/* Navbar */}
    <Navbar />

    {/* Main Text */}
    <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 text-white">
        <div className="text-left md:w-1/2">
            <h1 className="text-5xl md:text-7xl font-extrabold uppercase leading-none">
            Bat's Up
            </h1>
            <h1 className="text-5xl md:text-4xl font-extrabold uppercase leading-none mt-2">
            Tournament
            </h1>
        </div>

        <div className="md:w-1/2 text-left md:text-right">
            <p className="text-5xl md:text-6xl font-bold">2025</p>
            <div className="w-20 h-[2px] bg-white my-4 md:ml-auto" />
            <p className="text-lg md:text-2xl font-light">Where legends are made.</p>
        </div>
        </div>
    </div>
    </header>
);
};

export default Header;

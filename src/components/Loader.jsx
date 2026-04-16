import React from 'react';
import loaderGif from '../assets/loader.gif';

const Loader = () => {
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <h1 className="text-3xl font-bold text-blue-800 mb-4 tracking-wide">Bats Up</h1>
    <img
        src={loaderGif}
        alt="Loading..."
        className="w-80 h-80"
    />
    </div>
);
};

export default Loader;

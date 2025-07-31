import React from "react";
import stadiumVideo from "../assets/stadium.mp4";

const StadiumVideoCard = () => {
    return (
        <div className="w-full bg-black py-10 flex justify-center items-center min-h-screen">
        <div className="w-[90%] max-w-6xl rounded-3xl overflow-hidden shadow-2xl relative">
            <video
            className="w-full h-full object-cover"
            src={stadiumVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="none" // disables preload to improve scroll performance
            />

            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-bold">Stadium Hype Reel</h2>
            <p className="text-sm">Get ready for the most electrifying cricket season ever! Stay tuned...</p>
            </div>
        </div>
        </div>
    );
};

export default StadiumVideoCard;

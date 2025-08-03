import React from "react";
import stadiumVideo from "../assets/stadium.mp4";
import { ArrowRight } from "lucide-react";

const StadiumVideoCard = () => {
return (
    <div className="w-full min-h-screen bg-black flex justify-center items-center py-10 rounded-b-[40px]">
    <div className="w-[90%] max-w-6xl rounded-3xl overflow-hidden shadow-2xl relative">
        <video
        className="w-full h-full object-cover"
        src={stadiumVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
        <h1
            className="text-white text-[70px] md:text-[110px] uppercase text-center drop-shadow-xl leading-[0.8] tracking-tight"
            style={{ fontFamily: "'Anton', sans-serif" }}
            >
            Bat’s Up
        </h1>


        </div>

        <div className="absolute bottom-10 left-6 right-6 bg-gradient-to-br from-black/10 to-black/5 backdrop-blur-xl text-white px-6 py-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl z-10">
        <p className="text-sm md:text-base max-w-xl leading-snug text-white/90">
            Sign up for Bat’s Up and unlock exclusive access to cricket tournaments, match insights, and player stories. Be the first to know when tickets go live!
        </p>
        <button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full flex items-center gap-2 transition-all shadow-md">
            LOGIN NOW <ArrowRight className="w-4 h-4" />
        </button>
        </div>

    </div>
    </div>
);
};

export default StadiumVideoCard;

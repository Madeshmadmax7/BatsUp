import React from "react";
import stadiumVideo from "../assets/stadium.mp4";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StadiumVideoCard = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-black flex justify-center items-center py-6 md:py-10 rounded-b-[30px] md:rounded-b-[40px] relative overflow-hidden">
            <div className="w-[95%] md:w-[90%] max-w-7xl rounded-2xl md:rounded-3xl overflow-hidden relative shadow-2xl">
                <video
                    className="w-full h-[300px] md:h-full object-cover"
                    src={stadiumVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label="Background video of cricket stadium"
                >
                    Your browser does not support the video tag.
                </video>

                {/* Overlay Title */}
                <div
                    className="absolute inset-0 flex flex-col justify-center items-center z-10"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                >
                    <h1 className="text-white text-[38px] sm:text-[50px] md:text-[90px] lg:text-[110px] uppercase text-center drop-shadow-xl leading-[0.9] tracking-tight">
                        Bat’s Up
                    </h1>
                </div>

                {/* Call-to-action */}
                <div className="absolute bottom-4 md:bottom-10 left-3 right-3 md:left-6 md:right-6 bg-gradient-to-br from-black/80 to-transparent backdrop-blur-md text-white px-4 md:px-6 py-3 md:py-5 rounded-2xl md:rounded-3xl flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 shadow-xl z-20">
                    
                    {/* Show text only on md+ screens */}
                    <p className="hidden md:block text-lg max-w-xl text-left">
                        Sign up for Bat’s Up and unlock exclusive access to cricket tournaments, match insights, and player stories. Be the first to know when tickets go live!
                    </p>

                    <button
                        onClick={() => navigate("/login")}
                        className="bg-yellow-400 text-black px-5 py-2 md:px-8 md:py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-500 transition text-sm md:text-base"
                        aria-label="Login now"
                    >
                        LOGIN NOW <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StadiumVideoCard;

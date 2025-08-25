import React from "react";
import stadiumVideo from "../assets/stadium.mp4";
import { ArrowRight } from "lucide-react";

const StadiumVideoCard = () => {
    return (
        <div className="w-full min-h-screen bg-black flex justify-center items-center py-10 rounded-b-[40px] relative overflow-hidden">
            <div className="w-[90%] max-w-7xl rounded-3xl overflow-hidden relative shadow-2xl">
                <video
                    className="w-full h-full object-cover"
                    src={stadiumVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label="Background video of cricket stadium"
                >
                    {/* Fallback message for browsers that don't support <video> */}
                    Your browser does not support the video tag.
                </video>

                {/* Overlay content */}
                <div
                    className="absolute inset-0 flex flex-col justify-center items-center z-10"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                >
                    <h1 className="text-white text-[70px] md:text-[110px] uppercase text-center drop-shadow-xl leading-[0.8] tracking-tight">
                        Bat’s Up
                    </h1>
                </div>

                {/* Call-to-action */}
                <div className="absolute bottom-10 left-6 right-6 bg-gradient-to-br from-black/80 to-transparent backdrop-blur-xl text-white px-6 py-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl z-20">
                    <p className="text-sm md:text-lg max-w-xl">
                        Sign up for Bat’s Up and unlock exclusive access to cricket tournaments, match insights, and player stories. Be the first to know when tickets go live!
                    </p>
                    <button
                        onClick={() => window.location.href = "/login"}
                        className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-500 transition"
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

import React from "react";
import { Trophy, Users, Shield } from "lucide-react";
import cricketBg from "../assets/AboutUsbg.jpg";

const AboutUs = () => {
return (
    <div className="bg-black text-white w-full min-h-screen">
    {/* Hero Section */}
    <div
        className="relative w-full h-[75vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${cricketBg})` }}
    >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-wide drop-shadow-lg">
            About <span className="text-yellow-400">Bat's Up</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200 leading-relaxed">
            Connecting cricket lovers through technology, fair play, and a passionate community.
        </p>
        </div>
    </div>

    {/* Content Section */}
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-20">
        {/* Who We Are */}
        <section className="text-center md:text-left">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6 relative inline-block">
            Who We Are
            <span className="absolute -bottom-2 left-0 w-20 h-1 bg-yellow-500"></span>
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
            <strong className="text-white">Bat's Up</strong> is a dynamic cricket tournament platform
            built for passionate players and fans. We bring the thrill of cricket to life with
            cutting-edge tools for seamless tournament management, fan engagement, and live match experiences.
        </p>
        </section>

        {/* Mission Statement */}
        <section className="text-center md:text-left">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6 relative inline-block">
            Our Mission
            <span className="absolute -bottom-2 left-0 w-20 h-1 bg-yellow-500"></span>
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
            Our mission is to connect players, fans, and organizers with technology that empowers
            fairness, real-time updates, and community spirit. We ensure that every run, wicket, 
            and cheer is captured and celebrated.
        </p>
        </section>

        {/* Features Section */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
        {[
            {
            icon: <Trophy className="mx-auto h-14 w-14 text-yellow-400 mb-6" />,
            title: "Tournaments",
            description:
                "Easily host or join thrilling cricket tournaments with smart scheduling and real-time score updates.",
            },
            {
            icon: <Users className="mx-auto h-14 w-14 text-yellow-400 mb-6" />,
            title: "Community",
            description:
                "Build your cricket network, create teams, share moments, and fuel your passion for the game.",
            },
            {
            icon: <Shield className="mx-auto h-14 w-14 text-yellow-400 mb-6" />,
            title: "Fair Play",
            description:
                "From transparent scoring to honest competition — fair play is at our heart.",
            },
        ].map((feature, index) => (
            <div
            key={index}
            className="bg-[#1a1d24] rounded-2xl p-8 border border-gray-800 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-2"
            >
            {feature.icon}
            <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-400 text-base leading-relaxed">{feature.description}</p>
            </div>
        ))}
        </section>
    </div>
    </div>
);
};

export default AboutUs;

import React from "react";
import { Trophy, Users, Shield } from "lucide-react";
import cricketBg from "../assets/AboutUsbg.jpg";

const AboutUs = () => {
return (
    <div className="bg-black text-white w-full min-h-screen">
    <div
        className="relative w-full h-[75vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${cricketBg})` }}
    >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-6 w-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold uppercase">
            About <span className="text-yellow-400">Bat's Up</span>
        </h1>
        </div>
    </div>

    <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 space-y-16">
        <section>
        <h2 className="text-3xl font-bold text-yellow-400 mb-4 border-b border-yellow-400 pb-2 inline-block">
            Who We Are
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed">
            <strong className="text-white">Bat's Up</strong> is a bold cricket tournament platform
            built for passionate players and fans. We bring the excitement of cricket to life with
            digital tools that make tournament management easy, engaging, and fun.
        </p>
        </section>

        <section>
        <h2 className="text-3xl font-bold text-yellow-400 mb-4 border-b border-yellow-400 pb-2 inline-block">
            Our Mission
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed">
            Our mission is to bridge players, fans, and organizers through technology that promotes
            fairness, real-time access, and connection. We’re here to amplify every run, wicket, and
            roar of the crowd.
        </p>
        </section>

        <section className="grid md:grid-cols-3 gap-10 text-center">
        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-gray-900 hover:shadow-yellow-400/30 transition duration-300">
            <Trophy className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Tournaments</h3>
            <p className="text-gray-400 text-sm">
            Host and join thrilling cricket tournaments with smart scheduling and real-time
            updates.
            </p>
        </div>

        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-gray-900 hover:shadow-yellow-400/30 transition duration-300">
            <Users className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Community</h3>
            <p className="text-gray-400 text-sm">
            Grow your cricket network, create teams, and unite players around shared passion.
            </p>
        </div>

        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-gray-900 hover:shadow-yellow-400/30 transition duration-300">
            <Shield className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Fair Play</h3>
            <p className="text-gray-400 text-sm">
            From scoring transparency to honest competition, fair play is our foundation.
            </p>
        </div>
        </section>
    </div>
    </div>
);
};

export default AboutUs;

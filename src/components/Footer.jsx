import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const [tournament, setTournament] = useState(null);
    const [newsletter, setNewsletter] = useState(null);
    const [showTournament, setShowTournament] = useState(false);
    const [showNewsletter, setShowNewsletter] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/api/tournaments/get")
            .then((res) => res.json())
            .then((data) => {
                // Pick the first (if any) tournament for showcase.
                setTournament(data && data.length ? data[0] : null);
            })
            .catch(() => setTournament(null));

        fetch("http://localhost:8080/api/newsletter/all")
            .then((res) => res.json())
            .then((data) => {
                // Pick one random newsletter for showcase.
                if (data && data.length) {
                    const randomIdx = Math.floor(Math.random() * data.length);
                    setNewsletter(data[randomIdx]);
                } else {
                    setNewsletter(null);
                }
            })
            .catch(() => setNewsletter(null));
    }, []);

    return (
        <div className="bg-black text-white">
            <footer className="px-6 py-16">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
                    {/* Tournament Section LEFT */}
                    <div
                        className="rounded-3xl overflow-hidden relative h-[320px] bg-cover bg-center group cursor-pointer"
                        style={{
                            backgroundImage: tournament?.image
                                ? `url(${tournament.image})`
                                : "none",
                        }}
                        onClick={() => {
                            navigate("/tournaments");
                            setShowTournament(true);
                        }}
                    >
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300" />
                        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
                            <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg whitespace-pre-line">
                                {tournament
                                    ? `${tournament.tournamentName}\n${new Date(
                                        tournament.startDate
                                    ).toLocaleDateString()}`
                                    : "Tournament Details"}
                            </h2>
                            <button
                                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/tournaments`);
                                    setShowTournament(true);
                                }}
                            >
                                SEE TOURNAMENT →
                            </button>
                        </div>
                    </div>

                    {/* Newsletter Section RIGHT */}
                    <div
                        className="rounded-3xl overflow-hidden relative h-[320px] bg-cover bg-center group cursor-pointer"
                        style={{
                            backgroundImage: newsletter?.imageLink
                                ? `url(${newsletter.imageLink})`
                                : "none",
                        }}
                        onClick={() => {
                            navigate("/newsletter");
                            setShowNewsletter(true);
                        }}
                    >
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-all duration-300" />
                        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
                            <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
                                {newsletter ? newsletter.subject : "Newsletter & Features"}
                            </h2>
                            <button
                                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/newsletter");
                                    setShowNewsletter(true);
                                }}
                            >
                                VIEW NEWS →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tournament Popup */}
                {showTournament && tournament && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <div className="bg-white text-black rounded-xl p-8 max-w-lg shadow-xl relative">
                            <button
                                className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
                                onClick={() => setShowTournament(false)}
                            >
                                &times;
                            </button>
                            {tournament.image && (
                                <img
                                    src={tournament.image}
                                    alt={tournament.tournamentName}
                                    className="w-full h-48 object-cover mb-4 rounded-lg"
                                />
                            )}
                            <h2 className="text-2xl font-bold mb-2">{tournament.tournamentName}</h2>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Start:</span>{" "}
                                {new Date(tournament.startDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Location:</span> {tournament.location}
                            </p>
                            <p className="text-gray-600 mb-4">
                                <span className="font-semibold">Type:</span> {tournament.matchType}
                            </p>
                            <p className="text-gray-800">{tournament.description}</p>
                        </div>
                    </div>
                )}

                {/* Newsletter Popup */}
                {showNewsletter && newsletter && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <div className="bg-white text-black rounded-xl p-8 max-w-lg shadow-xl relative overflow-y-auto max-h-[90vh]">
                            <button
                                className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
                                onClick={() => setShowNewsletter(false)}
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold mb-2">{newsletter.subject}</h2>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold">Date:</span>{" "}
                                {newsletter.createdAt ? new Date(newsletter.createdAt).toLocaleDateString() : ""}
                            </p>
                            {newsletter.summary && (
                                <p className="text-gray-600 mb-4">{newsletter.summary}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer links and credits */}
                <div className="border-t border-gray-800 pt-12 pb-8">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-5 sm:grid-cols-2 gap-8 text-sm">
                        {[
                            {
                                heading: "MATCHES",
                                links: ["Live Scores", "Schedule", "Results", "Highlights"],
                            },
                            {
                                heading: "TEAMS",
                                links: ["India", "Australia", "England", "Pakistan"],
                            },
                            {
                                heading: "ABOUT",
                                links: ["Our Story", "Careers", "Privacy Policy", "Terms of Use"],
                            },
                            {
                                heading: "FAN ZONE",
                                links: ["Contests", "Player Stories", "Memes", "Fan Shop"],
                            },
                            {
                                heading: "TICKETS",
                                links: ["Buy Tickets", "Hospitality", "FAQs", "Support"],
                            },
                        ].map((section, idx) => (
                            <div key={idx}>
                                <h4 className="text-yellow-400 font-semibold mb-4 tracking-wide">
                                    {section.heading}
                                </h4>
                                <ul className="space-y-2 text-gray-400">
                                    {section.links.map((link, i) => (
                                        <li
                                            key={i}
                                            className="hover:text-yellow-300 transition-colors cursor-pointer"
                                        >
                                            {link}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-xs tracking-wide">
                    <p className="mb-2 text-white font-bold text-lg">Bat's Up</p>
                    <p>© {new Date().getFullYear()} Bat's Up. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;

// import React from "react";
// import newsBg from "../assets/pic-4.jpg";
// import matchBg from "../assets/pic-2.jpg";

// const Footer = () => {
// return (
//     <div className="bg-black text-white">
//         <footer className="px-6 py-16">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
//         <div
//             className="rounded-3xl overflow-hidden relative h-[320px] bg-cover bg-center group"
//             style={{ backgroundImage: `url(${newsBg})` }}
//         >
//             <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300" />
//             <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
//             <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
//                 Match Reports, <br /> Features & Analysis
//             </h2>
//             <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
//                 LEARN MORE →
//             </button>
//             </div>
//         </div>

//         <div
//             className="rounded-3xl overflow-hidden relative h-[320px] bg-cover bg-center group"
//             style={{ backgroundImage: `url(${matchBg})` }}
//         >
//             <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300" />
//             <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
//             <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
//                 Video Highlights, <br /> Hot Shots & Interviews
//             </h2>
//             <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
//                 LEARN MORE →
//             </button>
//             </div>
//         </div>
//         </div>

//         <div className="border-t border-gray-800 pt-12 pb-8">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-5 sm:grid-cols-2 gap-8 text-sm">
//             {[
//             {
//                 heading: "MATCHES",
//                 links: ["Live Scores", "Schedule", "Results", "Highlights"],
//             },
//             {
//                 heading: "TEAMS",
//                 links: ["India", "Australia", "England", "Pakistan"],
//             },
//             {
//                 heading: "ABOUT",
//                 links: ["Our Story", "Careers", "Privacy Policy", "Terms of Use"],
//             },
//             {
//                 heading: "FAN ZONE",
//                 links: ["Contests", "Player Stories", "Memes", "Fan Shop"],
//             },
//             {
//                 heading: "TICKETS",
//                 links: ["Buy Tickets", "Hospitality", "FAQs", "Support"],
//             },
//             ].map((section, idx) => (
//             <div key={idx}>
//                 <h4 className="text-yellow-400 font-semibold mb-4 tracking-wide">
//                 {section.heading}
//                 </h4>
//                 <ul className="space-y-2 text-gray-400">
//                 {section.links.map((link, i) => (
//                     <li
//                     key={i}
//                     className="hover:text-yellow-300 transition-colors cursor-pointer"
//                     >
//                     {link}
//                     </li>
//                 ))}
//                 </ul>
//             </div>
//             ))}
//         </div>
//         </div>

//         <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-xs tracking-wide">
//         <p className="mb-2 text-white font-bold text-lg">Bat's Up</p>
//         <p>© {new Date().getFullYear()} Bat's Up. All rights reserved.</p>
//         </div>
//     </footer>
//     </div>
// );
// };

// export default Footer;

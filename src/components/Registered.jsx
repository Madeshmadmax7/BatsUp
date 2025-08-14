import React from "react";
import pic6 from "../assets/pic-6.jpg";
import pic7 from "../assets/pic-7.jpg";
import pic8 from "../assets/pic-8.jpg";
import pic9 from "../assets/pic-9.jpg";
import pic10 from "../assets/pic-10.jpg";
import pic11 from "../assets/pic-11.jpg";
import pic12 from "../assets/pic-12.jpg";
import pic13 from "../assets/pic-13.jpg";
import pic14 from "../assets/pic-14.jpg";

const tournaments = [
{
    image: pic6,
    title: "Neo Cup 2025",
    date: "August 12",
    type: "Adult",
    location: "Mumbai",
    description: "An elite clash of cricketing giants. Join and conquer!",
    teams: ["Team A", "Team B", "Team C"],
},
{
    image: pic7,
    title: "Veterans Premier Battle",
    date: "August 14",
    type: "Veteran",
    location: "Chennai",
    description: "Legends return to the pitch. Don’t miss it!",
    teams: ["Legends XI", "Old Guards"],
},
{
    image: pic8,
    title: "College Kings Trophy",
    date: "August 16",
    type: "Women",
    location: "Bangalore",
    description: "College teams go head-to-head. Be the champion!",
    teams: ["College Queens", "Campus Stars", "Power Girls"],
},
{
    image: pic9,
    title: "Junior Slam Series",
    date: "August 18",
    type: "Kids",
    location: "Delhi",
    description: "Showcase your school’s pride in this thrilling series.",
    teams: ["Delhi Juniors", "Little Champs"],
},
{
    image: pic10,
    title: "Corporate Super Sixes",
    date: "August 20",
    type: "Corporate",
    location: "Hyderabad",
    description: "Corporate teams collide in a high-stakes cricket faceoff!",
    teams: ["Tech Titans", "Biz Bashers", "Office Warriors"],
},
{
    image: pic11,
    title: "Street Premier League",
    date: "August 22",
    type: "Men",
    location: "Kolkata",
    description: "Where street heroes shine on big turf.",
    teams: ["Street Kings", "Turf Tigers"],
},
{
    image: pic12,
    title: "Gully Cricket Cup",
    date: "August 24",
    type: "Men",
    location: "Pune",
    description: "True desi cricket vibes — from gully to glory.",
    teams: ["Gully Boys", "Local Legends"],
},
{
    image: pic13,
    title: "State Challenger Series",
    date: "August 26",
    type: "Kids",
    location: "Ahmedabad",
    description: "Rise through the state-level battles!",
    teams: ["State Strikers", "Junior Challengers"],
},
{
    image: pic14,
    title: "Night Knockout League",
    date: "August 28",
    type: "Adults",
    location: "Jaipur",
    description: "Floodlights. Fast action. Intense finishes.",
    teams: ["Night Ninjas", "Midnight Warriors"],
},
];

const Registered = () => {
return (
    <div className="bg-black min-h-screen px-6 py-10">
    <h1 className="text-white text-3xl font-bold mb-8 text-center">
        Registered Tournaments
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament, index) => (
        <div
            key={index}
            className="bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transform transition duration-300"
        >
            {/* Image */}
            <img
            src={tournament.image}
            alt={tournament.title}
            className="w-full h-40 object-cover"
            />

            {/* Details */}
            <div className="p-4">
            <h2 className="text-lg font-bold">{tournament.title}</h2>
            <p className="text-xs text-gray-400 mb-2">
                {tournament.date} • {tournament.type} • {tournament.location}
            </p>
            <p className="text-sm mb-4">{tournament.description}</p>

            {/* Teams */}
            <div className="flex flex-wrap gap-2">
                {tournament.teams.map((team, i) => (
                <button
                    key={i}
                    className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs hover:bg-purple-700 active:scale-95 transition"
                >
                    {team}
                </button>
                ))}
            </div>
            </div>
        </div>
        ))}
    </div>
    </div>
);
};

export default Registered;

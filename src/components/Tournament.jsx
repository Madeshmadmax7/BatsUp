// Tournament.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./Form";

const Tournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/tournaments/get")
      .then((res) => setTournaments(res.data))
      .catch(() => setTournaments([]));
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedTournament ? "hidden" : "auto";
  }, [selectedTournament]);

  return (
    <div className="bg-black min-h-screen px-6 py-10 text-white overflow-x-hidden">
      <h2 className="text-4xl font-bold mb-10 text-center mt-14">Upcoming Tournaments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-white text-black rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedTournament(tournament)}
          >
            <div className="relative">
              <img
                src={tournament.image}
                alt={tournament.tournamentName}
                className="w-full h-60 object-cover"
              />
              <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                LEARN MORE
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded uppercase font-semibold">
                  {tournament.matchType}
                </span>
                <span className="text-sm text-gray-600">
                  {tournament.startDate}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{tournament.tournamentName}</h3>
              <p className="text-gray-700 mb-4">{tournament.description}</p>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded">
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTournament && (
        <Form
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
        />
      )}
    </div>
  );
};

export default Tournament;



// import React, { useState, useEffect } from "react";
// import pic6 from "../assets/pic-6.jpg";
// import pic7 from "../assets/pic-7.jpg";
// import pic8 from "../assets/pic-8.jpg";
// import pic9 from "../assets/pic-9.jpg";
// import pic10 from "../assets/pic-10.jpg";
// import pic11 from "../assets/pic-11.jpg";
// import pic12 from "../assets/pic-12.jpg";
// import pic13 from "../assets/pic-13.jpg";
// import pic14 from "../assets/pic-14.jpg";
// import Form from "./Form";

// const tournaments = [
//   {
//     image: pic6,
//     title: "Neo Cup 2025",
//     date: "August 12",
//     type: "Adult",
//     location: "Mumbai",
//     description: "An elite clash of cricketing giants. Join and conquer!",
//   },
//   {
//     image: pic7,
//     title: "Veterans Premier Battle",
//     date: "August 14",
//     type: "Veteran",
//     location: "Chennai",
//     description: "Legends return to the pitch. Don’t miss it!",
//   },
//   {
//     image: pic8,
//     title: "College Kings Trophy",
//     date: "August 16",
//     type: "Women",
//     location: "Bangalore",
//     description: "College teams go head-to-head. Be the champion!",
//   },
//   {
//     image: pic9,
//     title: "Junior Slam Series",
//     date: "August 18",
//     type: "Kids",
//     location: "Delhi",
//     description: "Showcase your school’s pride in this thrilling series.",
//   },
//   {
//     image: pic10,
//     title: "Corporate Super Sixes",
//     date: "August 20",
//     type: "Corporate",
//     location: "Hyderabad",
//     description: "Corporate teams collide in a high-stakes cricket faceoff!",
//   },
//   {
//     image: pic11,
//     title: "Street Premier League",
//     date: "August 22",
//     type: "Men",
//     location: "Kolkata",
//     description: "Where street heroes shine on big turf.",
//   },
//   {
//     image: pic12,
//     title: "Gully Cricket Cup",
//     date: "August 24",
//     type: "Men",
//     location: "Pune",
//     description: "True desi cricket vibes — from gully to glory.",
//   },
//   {
//     image: pic13,
//     title: "State Challenger Series",
//     date: "August 26",
//     type: "Kids",
//     location: "Ahmedabad",
//     description: "Rise through the state-level battles!",
//   },
//   {
//     image: pic14,
//     title: "Night Knockout League",
//     date: "August 28",
//     type: "Adults",
//     location: "Jaipur",
//     description: "Floodlights. Fast action. Intense finishes.",
//   },
// ];

// const Tournament = () => {
//   const [selectedTournament, setSelectedTournament] = useState(null);

//   useEffect(() => {
//     document.body.style.overflow = selectedTournament ? "hidden" : "auto";
//   }, [selectedTournament]);

//   return (
//     <div className="bg-black min-h-screen px-6 py-10 text-white overflow-x-hidden">
//       <h2 className="text-4xl font-bold mb-10 text-center mt-14">Upcoming Tournaments</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//         {tournaments.map((tournament, index) => (
//           <div
//             key={index}
//             className="bg-white text-black rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 cursor-pointer"
//             onClick={() => setSelectedTournament(tournament)}
//           >
//             <div className="relative">
//               <img
//                 src={tournament.image}
//                 alt={tournament.title}
//                 className="w-full h-60 object-cover"
//               />
//               <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">LEARN MORE</span>
//             </div>
//             <div className="p-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded uppercase font-semibold">
//                   {tournament.type}
//                 </span>
//                 <span className="text-sm text-gray-600">{tournament.date}</span>
//               </div>
//               <h3 className="text-xl font-semibold mb-2">{tournament.title}</h3>
//               <p className="text-gray-700 mb-4">{tournament.description}</p>
//               <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded">
//                 Register Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedTournament && (
//         <Form
//           tournament={selectedTournament}
//           onClose={() => setSelectedTournament(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default Tournament;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./Form";

const Tournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    axios
      .get("https://batsup-vi-oz/api/tournaments")
      .then((res) => setTournaments(res.data))
      .catch(() => setTournaments([]));
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedTournament ? "hidden" : "auto";
  }, [selectedTournament]);

  return (
    <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-10 py-10 text-white overflow-x-hidden mt-20">
      <h2 className="text-4xl font-bold mb-10 text-center">Upcoming Tournaments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                <span className="bg-yellow-400 text-black text-xs uppercase font-semibold px-2 py-1">
                  {tournament.matchType || "N/A"}
                </span>
                <span className="text-sm">
                  {new Date(tournament.startDate).toLocaleDateString('en-GB')}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{tournament.tournamentName}</h3>
              <p className="mb-4">{tournament.description}</p>
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

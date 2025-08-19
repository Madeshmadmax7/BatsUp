import React, { useState, useEffect } from "react";
import axios from "axios";

function getRandomSubset(arr, count) {
    if (!arr || arr.length === 0) return [];
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function NewsLetter({ fanId, count = 3 }) {
    const [teams, setTeams] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [favorites, setFavorites] = useState([]); // Selected Teams
    const [favTournaments, setFavTournaments] = useState([]); // Selected Tournaments
    const [newsData, setNewsData] = useState([]);

    // Fetch teams
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/team/all")
            .then((res) => setTeams(res.data))
            .catch(() => setTeams([]));
    }, []);

    // Fetch tournaments
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/tournaments/get")
            .then((res) => setTournaments(res.data))
            .catch(() => setTournaments([]));
    }, []);

    // Fetch newsletters
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/newsletter/all")
            .then((res) => setNewsData(res.data))
            .catch(() => setNewsData([]));
    }, []);

    // Fetch fan favorites for teams and tournaments
    useEffect(() => {
        if (fanId) {
            axios
                .get(`http://localhost:8080/api/fan/${fanId}`)
                .then((res) => {
                    const fan = res.data;
                    setFavorites(
                        teams.filter((team) => (fan.followedTeamIds || []).includes(team.id))
                    );
                    setFavTournaments(
                        tournaments.filter((t) =>
                            (fan.followedTournamentIds || []).includes(t.id)
                        )
                    );
                })
                .catch(() => {
                    setFavorites([]);
                    setFavTournaments([]);
                });
        }
    }, [fanId, teams, tournaments]);

    // Random subset of newsletters
    const displayedNews = getRandomSubset(newsData, Math.min(count, newsData.length));

    // Toggle team selection
    const toggleFavorite = (team) => {
        const alreadyFav = favorites.some((f) => f.id === team.id);
        const updated = alreadyFav
            ? favorites.filter((f) => f.id !== team.id)
            : [...favorites, team];
        setFavorites(updated);

        if (fanId) {
            axios
                .put(`http://localhost:8080/api/fan/${fanId}/follow-teams`, updated.map((t) => t.id))
                .catch(console.error);
        }
    };

    // Toggle tournament selection
    const toggleTournament = (tournament) => {
        const alreadyFav = favTournaments.some((f) => f.id === tournament.id);
        const updated = alreadyFav
            ? favTournaments.filter((f) => f.id !== tournament.id)
            : [...favTournaments, tournament];
        setFavTournaments(updated);

        if (fanId) {
            axios
                .put(`http://localhost:8080/api/fan/${fanId}/follow-tournaments`, updated.map((t) => t.id))
                .catch(console.error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 mt-24 text-white">
            {/* Selected Picks */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold border-b-2 border-gray-500 pb-2 mb-4">Your Picks</h2>

                {/* Selected Teams */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Teams</h3>
                    {favorites.length === 0 ? (
                        <p className="text-gray-400 italic">No teams selected</p>
                    ) : (
                        <div className="flex space-x-6">
                            {favorites.map(({ id, teamName, logo }) => (
                                <div key={id} className="flex flex-col items-center cursor-pointer select-none">
                                    {logo ? (
                                        <img
                                            src={logo}
                                            alt={teamName}
                                            className="w-16 h-16 object-cover rounded-full border-2 border-gray-500 bg-white"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-400 font-bold text-sm">
                                            No Image
                                        </div>
                                    )}
                                    <span className="mt-2 text-white font-medium">{teamName}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Tournaments */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Tournaments</h3>
                    {favTournaments.length === 0 ? (
                        <p className="text-gray-400 italic">No tournaments selected</p>
                    ) : (
                        <div className="flex space-x-6">
                            {favTournaments.map(({ id, tournamentName, image }) => (
                                <div key={id} className="flex flex-col items-center cursor-pointer select-none">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={tournamentName}
                                            className="w-16 h-16 object-cover rounded-full border-2 border-gray-500 bg-white"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-400 font-bold text-sm">
                                            No Image
                                        </div>
                                    )}
                                    <span className="mt-2 text-white font-medium">{tournamentName}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletters */}
            <section>
                <h1 className="text-4xl mb-10 border-b-2 border-gray-500">Cricket News & Scores</h1>
                <div className="grid md:grid-cols-3 gap-10">
                    {displayedNews.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white text-black rounded-xl shadow-lg overflow-hidden transform transition hover:shadow-2xl hover:scale-105"
                        >
                            {item.imageLink ? (
                                <img
                                    src={item.imageLink}
                                    alt={item.subject}
                                    className="w-full h-48 object-cover rounded-t-xl"
                                    loading="lazy"
                                />
                            ) : null}
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-3 cursor-pointer">{item.subject}</h2>
                                <p className="mb-4">{item.summary}</p>
                                <p className="text-sm text-gray-500">
                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                                    {item.teamName ? ` | ${item.teamName}` : ""}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Choose Teams */}
            <section className="mt-20">
                <h2 className="text-3xl font-bold border-b-2 border-gray-500 pb-2 mb-6">Choose Teams</h2>
                <div className="flex flex-wrap gap-8">
                    {teams.length === 0 ? (
                        <p className="text-gray-400">No team data</p>
                    ) : (
                        teams.map((team) => {
                            const isFav = favorites.some((f) => f.id === team.id);
                            return (
                                <div
                                    key={team.id}
                                    className="flex flex-col items-center cursor-pointer select-none relative group"
                                    style={{ minWidth: "150px" }}
                                    onClick={() => toggleFavorite(team)}
                                >
                                    <div className="relative">
                                        {team.logo ? (
                                            <img
                                                src={team.logo}
                                                alt={team.teamName}
                                                className={`w-20 h-20 object-cover rounded-full border-2 ${isFav ? "border-gray-600" : "border-gray-400"
                                                    } bg-white transition-transform duration-200 group-hover:scale-105`}
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 font-bold text-sm">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-black hover:opacity-70 transition-opacity duration-300">
                                            <span className="text-white text-4xl font-bold select-none">
                                                {isFav ? "−" : "+"}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="mt-3 text-white font-medium">{team.teamName}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Choose Tournaments */}
            <section className="mt-20">
                <h2 className="text-3xl font-bold border-b-2 border-gray-500 pb-2 mb-6">Choose Tournaments</h2>
                <div className="flex flex-wrap gap-8">
                    {tournaments.length === 0 ? (
                        <p className="text-gray-400">No tournament data</p>
                    ) : (
                        tournaments.map((tournament) => {
                            const isFav = favTournaments.some((f) => f.id === tournament.id);
                            return (
                                <div
                                    key={tournament.id}
                                    className="flex flex-col items-center cursor-pointer select-none relative group"
                                    style={{ minWidth: "150px" }}
                                    onClick={() => toggleTournament(tournament)}
                                >
                                    <div className="relative">
                                        {tournament.image ? (
                                            <img
                                                src={tournament.image}
                                                alt={tournament.tournamentName}
                                                className={`w-20 h-20 object-cover rounded-full border-2 ${isFav ? "border-gray-600" : "border-gray-400"
                                                    } bg-white transition-transform duration-200 group-hover:scale-105`}
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-white rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 font-bold text-sm">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-black hover:opacity-70 transition-opacity duration-300">
                                            <span className="text-white text-4xl font-bold select-none">
                                                {isFav ? "−" : "+"}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="mt-3 text-white font-medium">{tournament.tournamentName}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
    );
}

export default NewsLetter;


// import React, { useState } from "react";

// import team1 from "../assets/pic-6.jpg";
// import team2 from "../assets/pic-7.jpg";
// import team3 from "../assets/pic-8.jpg";

// const newsData = [
// {
//     id: 1,
//     team: "Warriors",
//     teamImg: team1,
//     headline: "Warriors clinch thrilling win against Titans",
//     summary:
//     "In a nail-biting finish, Warriors secured victory with a last-over six.",
//     score: "Warriors 245/7 - Titans 243/9",
//     date: "Aug 10, 2025",
// },
// {
//     id: 2,
//     team: "Strikers",
//     teamImg: team2,
//     headline: "Strikers announce new captain for the season",
//     summary:
//     "Experienced batsman Rohit Sharma to lead Strikers for the upcoming tournaments.",
//     score: null,
//     date: "Aug 9, 2025",
// },
// {
//     id: 3,
//     team: "Titans",
//     teamImg: team3,
//     headline: "Titans sign promising young bowler",
//     summary:
//     "The Titans welcome 19-year-old fast bowler, aiming to boost their bowling attack.",
//     score: null,
//     date: "Aug 8, 2025",
// },
// ];

// const teams = [
// { id: 1, name: "Warriors", img: team1 },
// { id: 2, name: "Strikers", img: team2 },
// { id: 3, name: "Titans", img: team3 },
// ];

// const NewsLetter = () => {
// const [favorites, setFavorites] = useState([]);

// const toggleFavorite = (team) => {
//     setFavorites((prev) =>
//     prev.find((f) => f.id === team.id)
//         ? prev.filter((f) => f.id !== team.id)
//         : [...prev, team]
//     );
// };

// return (
//     <div className="max-w-6xl mx-auto px-6 mt-24 text-white">
//     <section className="mb-12">
//         <h2 className="text-3xl font-bold border-b-2 border-gray-500 pb-2 mb-6">
//         Your Picks
//         </h2>
//         {favorites.length === 0 ? (
//         <p className="text-gray-400 italic">No teams selected</p>
//         ) : (
//         <div className="flex space-x-6">
//             {favorites.map(({ id, name, img }) => (
//             <div key={id} className="flex flex-col items-center">
//                 <img
//                 src={img}
//                 alt={name}
//                 className="w-16 h-16 object-cover rounded-full border-2 border-gray-500 bg-white"
//                 />
//                 <span className="mt-2 text-white font-medium">{name}</span>
//             </div>
//             ))}
//         </div>
//         )}
//     </section>

//     <section>
//         <h1 className="text-4xl font-bold mb-10 border-b-2 border-gray-500 pb-2">
//         Cricket News & Scores
//         </h1>

//         <div className="grid md:grid-cols-3 gap-10">
//         {newsData.map(
//             ({ id, team, teamImg, headline, summary, score, date }) => (
//             <article
//                 key={id}
//                 className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl hover:scale-[1.02] text-gray-900"
//             >
//                 <img
//                 src={teamImg}
//                 alt={team}
//                 className="w-full h-48 object-cover rounded-t-xl"
//                 loading="lazy"
//                 />
//                 <div className="p-6">
//                 <h2 className="text-2xl font-semibold mb-3 hover:text-gray-700 cursor-pointer">
//                     {headline}
//                 </h2>
//                 <p className="mb-4 leading-relaxed">{summary}</p>
//                 {score && (
//                     <p className="inline-block bg-gray-200 text-gray-800 font-semibold text-sm px-3 py-1 rounded-lg mb-4">
//                     Score: {score}
//                     </p>
//                 )}
//                 <p className="text-sm text-gray-500">{date}</p>
//                 </div>
//             </article>
//             )
//         )}
//         </div>
//     </section>

//     <section className="mt-20">
//     <h2 className="text-3xl font-bold border-b-2 border-gray-500 pb-2 mb-6">
//         Choose Your Teams
//     </h2>
//     <div className="flex space-x-8">
//         {teams.map((team) => {
//         const isFav = favorites.some((f) => f.id === team.id);
//         return (
//             <div
//             key={team.id}
//             className="flex flex-col items-center cursor-pointer select-none relative group"
//             onClick={() => toggleFavorite(team)}
//             >
//             <div className="relative">
//                 <img
//                 src={team.img}
//                 alt={team.name}
//                 className={`w-20 h-20 object-cover rounded-full border-2 bg-white transition-transform duration-200 
//                 ${isFav ? "border-gray-600" : "border-gray-400"} group-hover:scale-105`}
//                 />

//                 <div className="absolute inset-0 flex items-center justify-center 
//                     rounded-full opacity-0 group-hover:opacity-100 hover:bg-black hover:opacity-70
//                     transition-opacity duration-300">
//                 <span className="text-white text-4xl font-bold drop-shadow-lg select-none">
//                     {isFav ? "−" : "+"}
//                 </span>
//                 </div>

//             </div>

//             <span className="mt-3 text-white font-medium text-center">
//                 {team.name}
//             </span>
//             </div>
//         );
//         })}
//     </div>
//     </section>

//     </div>
// );
// };

// export default NewsLetter;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Import React Router Link
import newsBg from "../assets/news.jpg";
import matchBg from "../assets/pic-6.jpg";


const CricketCards = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [matchCards, setMatchCards] = useState([]);
    const [teamScores, setTeamScores] = useState({});

    useEffect(() => {
        // Fetch news
        axios
            .get("https://batsup-v1-oauz.onrender.com/api/newsletter/all")
            .then((res) => {
                const data = res.data.map((item) => ({
                    type: item.type || "NEWS",
                    date: item.createdAt
                        ? new Date(item.createdAt)
                            .toLocaleDateString(undefined, { month: "short", day: "numeric" })
                            .toUpperCase()
                        : "-",
                    title: item.subject || "No Title",
                    image: item.imageLink || newsBg,
                    summary: item.summary || "",
                    teamName: item.teamName || "",
                    tournamentId: item.tournamentId || null,
                }));
                setNewsItems(data);
            })
            .catch(() => setNewsItems([]));

        // Fetch match scores
        axios
            .get("https://batsup-v1-oauz.onrender.com/api/scoredetails")
            .then((res) => {
                const data = res.data.map((match) => ({
                    stadium: match.stadium || "Unknown Stadium",
                    teams: match.teams || ["Team A", "Team B"],
                    scores: [
                        match.runsTeam1 != null && match.wicketsTeam1 != null
                            ? `${match.runsTeam1}/${match.wicketsTeam1}`
                            : "0/0",
                        match.runsTeam2 != null && match.wicketsTeam2 != null
                            ? `${match.runsTeam2}/${match.wicketsTeam2}`
                            : "0/0",
                    ],
                    overs: [
                        match.oversTeam1?.toString() || "0",
                        match.oversTeam2?.toString() || "0",
                    ],
                    duration: match.duration || "-",
                }));
                setMatchCards(data);
            })
            .catch(() => setMatchCards([]));

        // Fetch team scorecards and group them
        axios
            .get("https://batsup-v1-oauz.onrender.com/api/scorecard/all")
            .then((res) => {
                const grouped = res.data.reduce((acc, curr) => {
                    const team = curr.teamName || "Unknown Team";
                    if (!acc[team]) {
                        acc[team] = { teamName: team, totalRuns: 0, totalWickets: 0, players: [] };
                    }
                    acc[team].totalRuns += curr.runs || 0;
                    acc[team].totalWickets += curr.wickets || 0;
                    if (curr.playerName) acc[team].players.push(curr.playerName);
                    return acc;
                }, {});
                setTeamScores(grouped);
            })
            .catch(() => setTeamScores({}));
    }, []);

    return (
        <div className="min-h-screen bg-black px-10 py-16 flex justify-center items-center font-sans">
            <div className="w-full max-w-[1400px] flex gap-8">

                {/* News Section */}
                <div
                    className="w-[600px] h-[450px] rounded-3xl overflow-hidden relative p-6"
                    style={{
                        backgroundImage: `url(${newsBg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50 z-0" />
                    <div className="relative z-10 flex flex-col justify-center gap-5 h-full w-[270px]">
                        {newsItems.length === 0 && (
                            <p className="text-white/70 text-sm">No news available.</p>
                        )}
                        {newsItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex justify-between items-start hover:bg-white/20 transition"
                            >
                                <div>
                                    <div className="flex items-center text-xs mb-1">
                                        <span
                                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide text-black ${item.type === "VIDEO" ? "bg-green-300" : "bg-blue-300"
                                                }`}
                                        >
                                            {item.type}
                                        </span>
                                        <span className="ml-3 text-white/70 text-[10px]">
                                            {item.date}
                                        </span>
                                    </div>
                                    <h2 className="text-sm font-medium text-white max-w-[220px]">
                                        {item.title}
                                    </h2>
                                </div>
                                <Plus className="w-4 h-4 text-white/70 mt-1" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Match & Scores Section */}
                <div
                    className="flex-1 h-[450px] rounded-3xl overflow-hidden relative p-6"
                    style={{
                        backgroundImage: `url(${matchBg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black/40 z-0" />
                    <div className="relative z-10 h-full flex flex-col justify-end">

                        {/* Match cards */}
                        <div className="flex gap-6 overflow-x-auto hide-scrollbar mb-6">
                            {matchCards.length !== 0 && (
                                <p className="text-white/70 text-sm">No match data available.</p>
                            )}
                            {matchCards.map((match, idx) => (
                                <div
                                    key={idx}
                                    className="w-[320px] min-w-[320px] h-[230px] bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="text-sm text-white/80 mb-2">
                                            {match.stadium}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold text-white">
                                                    {match.teams[0]}
                                                </div>
                                                <div className="font-semibold text-white">
                                                    {match.teams}
                                                </div>
                                            </div>
                                            <div className="text-right text-white/80 text-sm">
                                                <div>
                                                    <span className="text-yellow-300 mr-2">●</span>
                                                    {match.scores}
                                                </div>
                                                <div>{match.scores}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-white/70 text-xs">
                                            <span>OVERS</span>
                                            <div className="flex gap-4">
                                                <span>{match.overs}</span>
                                                <span>{match.overs}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-white/60 mt-4">
                                        <span>DURATION: {match.duration}</span>
                                        <button className="bg-yellow-300 text-black px-3 py-1 rounded-md text-xs font-semibold">
                                            VIEW HIGHLIGHTS
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Team Score Summaries */}
                        {/* Team Score Summaries */}
                        <div className="mt-6">
                            {Object.values(teamScores).length === 0 && (
                                <p className="text-white/70">No scorecard data available.</p>
                            )}

                            {/* Horizontal scroll container */}
                            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
                                {Object.values(teamScores).map((team) => (
                                    <div
                                        key={team.teamName}
                                        className="w-[320px] min-w-[320px] h-[200px] bg-white/10 
                    backdrop-blur-md border border-white/10 rounded-xl 
                    p-6 flex flex-col justify-between"
                                    >
                                        <div>
                                            <p className="text-white font-semibold text-lg mb-2">
                                                {team.teamName}
                                            </p>
                                            <p className="text-white/80 text-sm mb-1">
                                                Runs: <span className="font-semibold">{team.totalRuns}</span> |
                                                Wickets: <span className="font-semibold">{team.totalWickets}</span>
                                            </p>
                                            <p className="text-white/70 text-xs line-clamp-2">
                                                Players: {team.players.join(", ") || "N/A"}
                                            </p>
                                        </div>

                                        {/* Smaller button */}
                                        <Link
                                            to={`/scores/${team.teamName}`}
                                            className="self-end mt-3 bg-yellow-300 text-black px-2 py-0.5 
                                            rounded text-[10px] font-semibold 
                                            hover:bg-yellow-400 transition"
                                        >
                                            SCORE
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CricketCards;


// import React from "react";
// import { Plus } from "lucide-react";
// import newsBg from "../assets/news.jpg";
// import matchBg from "../assets/pic-6.jpg";

// const CricketCards = () => {
// const newsItems = [
//     { type: "NEWS", date: "JULY 30", title: "India stuns Australia in World Cup semi-final" },
//     { type: "VIDEO", date: "JULY 29", title: "Top 10 Sixes of the Tournament – Must Watch!" },
//     { type: "NEWS", date: "JULY 28", title: "Bumrah’s Yorker Masterclass: A Breakdown" },
// ];

// const matchCards = [
//     {
//     stadium: "Mumbai Stadium",
//     teams: ["🇮🇳 India", "🇦🇺 Australia"],
//     scores: ["320/8", "311/10"],
//     overs: ["50", "49.3"],
//     duration: "7h 15m",
//     },
//     {
//     stadium: "Chennai Stadium",
//     teams: ["🇵🇰 Pakistan", "🇬🇧 England"],
//     scores: ["298/7", "295/9"],
//     overs: ["50", "50"],
//     duration: "6h 42m",
//     },
//     {
//     stadium: "Delhi Stadium",
//     teams: ["🇿🇦 South Africa", "🇳🇿 New Zealand"],
//     scores: ["310/5", "290/9"],
//     overs: ["50", "50"],
//     duration: "7h 0m",
//     },
// ];

// return (
//     <div className="min-h-screen bg-black px-10 py-16 flex justify-center items-center font-sans">
//     <div className="w-full max-w-[1400px] flex gap-8">
//         <div
//         className="w-[600px] h-[450px] rounded-3xl overflow-hidden relative p-6"
//         style={{ backgroundImage: `url(${newsBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
//         >
//         <div className="absolute inset-0 bg-black/50 z-0" />
//         <div className="relative z-10 flex flex-col justify-center gap-5 h-full w-[270px]">
//             {newsItems.map((item, idx) => (
//             <div
//                 key={idx}
//                 className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex justify-between items-start hover:bg-white/20 transition"
//             >
//                 <div>
//                 <div className="flex items-center text-xs mb-1">
//                     <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide text-black ${item.type === "VIDEO" ? "bg-green-300" : "bg-blue-300"}`}>
//                     {item.type}
//                     </span>
//                     <span className="ml-3 text-white/70 text-[10px]">{item.date}</span>
//                 </div>
//                 <h2 className="text-sm font-medium text-white max-w-[220px]">{item.title}</h2>
//                 </div>
//                 <Plus className="w-4 h-4 text-white/70 mt-1" />
//             </div>
//             ))}
//         </div>
//         </div>

//         <div
//         className="flex-1 h-[450px] rounded-3xl overflow-hidden relative p-6"
//         style={{ backgroundImage: `url(${matchBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
//         >
//         <div className="absolute inset-0 bg-black/40 z-0" />
//         <div className="relative z-10 h-full flex flex-col justify-end">
//             <div className="flex gap-6 overflow-x-auto hide-scrollbar">
//             {matchCards.map((match, idx) => (
//                 <div
//                 key={idx}
//                 className="w-[320px] min-w-[320px] h-[230px] bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col justify-between"
//                 >
//                 <div>
//                     <div className="text-sm text-white/80 mb-2">{match.stadium}</div>
//                     <div className="flex justify-between items-center">
//                     <div>
//                         <div className="font-semibold text-white">{match.teams[0]}</div>
//                         <div className="font-semibold text-white">{match.teams[1]}</div>
//                     </div>
//                     <div className="text-right text-white/80 text-sm">
//                         <div>
//                         <span className="text-yellow-300 mr-2">●</span>{match.scores[0]}
//                         </div>
//                         <div>{match.scores[1]}</div>
//                     </div>
//                     </div>
//                     <div className="flex justify-between mt-2 text-white/70 text-xs">
//                     <span>OVERS</span>
//                     <div className="flex gap-4">
//                         <span>{match.overs[0]}</span>
//                         <span>{match.overs[1]}</span>
//                     </div>
//                     </div>
//                 </div>
//                 <div className="flex justify-between items-center text-xs text-white/60 mt-4">
//                     <span>DURATION: {match.duration}</span>
//                     <button className="bg-yellow-300 text-black px-3 py-1 rounded-md text-xs font-semibold">
//                     VIEW HIGHLIGHTS
//                     </button>
//                 </div>
//                 </div>
//             ))}
//             </div>
//         </div>
//         </div>

//     </div>
//     </div>
// );
// };

// export default CricketCards;

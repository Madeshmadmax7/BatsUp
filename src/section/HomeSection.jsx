import React from "react";
import Header from "../components/Header";
import CricketDashboard from "../components/CricketDashboard";
import StadiumVideoCard from "../components/StadiumVideoCard";
import TournamentDisplay from "../components/TournamentDisplay";

const Home = () => {
    return (
        <div className="bg-[#f8f4e6] rounded-b-3xl">
            <Header />
            <CricketDashboard />
            <StadiumVideoCard />
            <TournamentDisplay/>
        </div>
    );
};

export default Home;

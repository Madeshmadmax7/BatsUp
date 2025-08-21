export const API_BASE = "http://localhost:8080"; // update if needed

export function clsx(...parts) {
    return parts.filter(Boolean).join(" ");
}

export const apiService = {
    // Tournaments
    async getTournaments() {
        const res = await fetch(`${API_BASE}/api/tournaments/get`);
        return await res.json();
    },

    async createTournament(tournamentForm) {
        const res = await fetch(`${API_BASE}/api/tournaments/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tournamentForm),
        });
        if (!res.ok) throw new Error("Create failed");
        return res;
    },

    // Teams
    async getTeamsByTournament(tournamentId) {
        const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/teams`);
        return await res.json();
    },

    async removeTeamFromTournament(tournamentId, teamId) {
        const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/remove-team/${teamId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Remove failed");
        return res;
    },

    // Players
    async getAllPlayers() {
        const res = await fetch(`${API_BASE}/api/player/all`);
        return await res.json();
    },

    // Scorecards
    async getAllScorecards() {
        const res = await fetch(`${API_BASE}/api/scorecard/all`);
        return await res.json();
    },

    async createScorecard(payload) {
        return await fetch(`${API_BASE}/api/scorecard/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    },

    async updateScorecard(id, dto) {
        return await fetch(`${API_BASE}/api/scorecard/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
        });
    },

    async deleteScorecard(id) {
        return await fetch(`${API_BASE}/api/scorecard/${id}`, { method: "DELETE" });
    },

    // Newsletter
    async getAllNewsletters() {
        const res = await fetch(`${API_BASE}/api/newsletter/all`);
        return await res.json();
    },

    async createNewsletter(payload) {
        const res = await fetch(`${API_BASE}/api/newsletter/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
        return res;
    },

    async deleteNewsletter(id) {
        const res = await fetch(`${API_BASE}/api/newsletter/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        return res;
    },

    // Rounds/Fixtures
    async getRoundsByTournament(tournamentId) {
        const axios = (await import('axios')).default;
        const res = await axios.get(`${API_BASE}/api/round/tournament/${tournamentId}`);
        return res.data;
    },

    async generateFixture(tournamentId) {
        const axios = (await import('axios')).default;
        return await axios.post(`${API_BASE}/api/round/generate`, null, { params: { tournamentId } });
    }
};
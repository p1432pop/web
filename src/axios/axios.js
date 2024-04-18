import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:8080",
});

export const Api = {
	getMainRanking: async () => {
		const res = await axiosInstance.get("/rank");
		return res.data;
	},
	getRanking: async (seasonId, page) => {
		const res = await axiosInstance.get(`/rank/${seasonId}`, { params: { page } });
		return res.data;
	},
	updatedPlayer: async (userNum, nickname) => {
		const res = await axiosInstance.post("/player", {
			userNum,
			nickname,
		});
		res.data.playerData.updated = new Date(res.data.playerData.updated);
		gameSetting(res.data.playerData.games);
		return {
			status: 200,
			data: res.data,
		};
	},
	getPlayerRecentData: async (nickname) => {
		try {
			const res = await axiosInstance.get(`/player/recent/${nickname}/23`);
			res.data.playerData.updated = new Date(res.data.playerData.updated);
			gameSetting(res.data.playerData.games);
			return {
				status: 200,
				data: res.data,
			};
		} catch (err) {
			return {
				status: 404,
			};
		}
	},
	getPlayerPastData: async (userNum, next) => {
		const res = await axiosInstance.get(`/player/past/${userNum}`, { params: { next } });
		gameSetting(res.data.games);
		return res.data;
	},
	getGame: async (gameId) => {
		const res = await axiosInstance.get(`/game/${gameId}`);
		return res.data;
	},
};

function gameSetting(games) {
	for (let game of games) {
		let equip = [];
		let obj = JSON.parse(game.equipment);
		for (let i = 0; i < 5; i++) {
			equip.push(obj[`${i}`]);
		}
		game.equipment = equip;
		game.traitFirstSub = JSON.parse(game.traitFirstSub);
		game.traitSecondSub = JSON.parse(game.traitSecondSub);
	}
}

import axios from "axios";
import { ItemConsumableDTO, ItemWearableDTO } from "./dto/item/item.dto";
import { NewsDTO } from "./dto/news/news.dto";
import { RankDTO } from "./dto/rank/rank.dto";
import { GameDTO } from "./dto/game/game.dto";
import { PlayerDTO } from "./dto/player/player.dto";

const axiosInstance = axios.create({
	baseURL: "http://localhost:8080",
});

export const Api = {
	getMainNews: async (): Promise<NewsDTO[]> => {
		const res = await axiosInstance.get<NewsDTO[]>("/news");
		return res.data;
	},
	getItemConsumable: async (consumableType?: string): Promise<ItemConsumableDTO[]> => {
		const res = await axiosInstance.get<ItemConsumableDTO[]>("/item/consumable", {
			params: { consumableType },
		});
		return res.data;
	},
	getItemWeapon: async (wearableType?: string): Promise<ItemWearableDTO[]> => {
		const res = await axiosInstance.get<ItemWearableDTO[]>("/item/weapon", {
			params: { weaponType: wearableType },
		});
		return res.data;
	},
	getItemArmor: async (wearableType?: string): Promise<ItemWearableDTO[]> => {
		const res = await axiosInstance.get<ItemWearableDTO[]>("/item/armor", {
			params: { armorType: wearableType },
		});
		return res.data;
	},
	getMainRanking: async (): Promise<RankDTO> => {
		const res = await axiosInstance.get<RankDTO>("/rank");
		return res.data;
	},
	getRanking: async (seasonId: number, page: number): Promise<RankDTO> => {
		const res = await axiosInstance.get<RankDTO>(`/rank/query`, {
			params: { seasonId, page },
		});
		return res.data;
	},
	updatedPlayer: async (userNum: number, nickname: string) => {
		const res = await axiosInstance.post("/player", {
			userNum,
			nickname,
		});
		console.log(res);
		res.data.playerData.updated = new Date(res.data.playerData.updated);
		gameSetting(res.data.playerData.games);
		return {
			status: 200,
			data: res.data,
		};
	},
	getPlayerRecentData: async (nickname: string): Promise<{ status: number; data?: PlayerDTO }> => {
		try {
			const res = await axiosInstance.get<PlayerDTO>(`/player/recent/${nickname}/23`);
			const nicknames = localStorage.getItem("nickname");
			if (nicknames) {
				const nicknamesArr: string[] = JSON.parse(nicknames);
				if (!nicknamesArr.includes(nickname)) {
					localStorage.setItem("nickname", JSON.stringify([...nicknamesArr, nickname]));
				}
			} else {
				localStorage.setItem("nickname", JSON.stringify([nickname]));
			}
			return {
				status: 200,
				data: res.data,
			};
		} catch (err) {
			console.log(err);
			return {
				status: 404,
			};
		}
	},
	getPlayerPastData: async (userNum: number, next: number) => {
		const res = await axiosInstance.get(`/player/past/${userNum}`, {
			params: { next },
		});
		return res.data;
	},
	getGame: async (gameId: number): Promise<GameDTO[][]> => {
		const res = await axiosInstance.get<GameDTO[]>(`/game/${gameId}`);
		let result = [];
		for (let i = 0; i < res.data.length; i += 3) {
			const team = res.data.slice(i, i + 3);
			result.push(team);
		}
		return result;
	},
};

function gameSetting(games: GameDTO[]) {
	for (let game of games) {
		const equipment: (number | undefined)[] = [game.equipment[0], game.equipment[1], game.equipment[2], game.equipment[3], game.equipment[4]];
		game.equipment = equipment;
	}
}

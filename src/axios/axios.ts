import axios from "axios";
import { ItemConsumableDTO, ItemWearableDTO } from "./dto/item/item.dto";
import { NewsDTO } from "./dto/news/news.dto";
import { RankDTO } from "./dto/rank/rank.dto";
import { GameDTO } from "./dto/game/game.dto";
import { userGamesQuery } from "./interface/player.interface";
import { UserResponseDTO } from "./dto/user/userResponse.dto";
import { UserGamesDTO } from "./dto/user/userGames.dto";

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
	updatedPlayer: async (userNum: number, nickname: string, updated: string | null): Promise<UserResponseDTO> => {
		const res = await axiosInstance.post("/user", {
			userNum,
			nickname,
			updated,
		});
		return res.data;
	},
	getUserProfile: async (nickname: string): Promise<UserResponseDTO> => {
		const res = await axiosInstance.get<UserResponseDTO>(`/user/profile/${nickname}`);
		if (res.data.code === 200) {
			const nicknames = localStorage.getItem("nickname");
			if (nicknames) {
				const nicknamesArr: string[] = JSON.parse(nicknames);
				if (!nicknamesArr.includes(nickname)) {
					localStorage.setItem("nickname", JSON.stringify([...nicknamesArr, nickname]));
				}
			} else {
				localStorage.setItem("nickname", JSON.stringify([nickname]));
			}
		}
		return res.data;
	},
	getUserGames: async (query: userGamesQuery): Promise<UserGamesDTO> => {
		const { userNum, next, isRank } = query;
		const res = await axiosInstance.get<UserGamesDTO>(`/user/games`, {
			params: { userNum, next, isRank },
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

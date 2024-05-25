import axios from "axios";
import { News } from "./RO";
import { ItemsConsumableDTO, ItemsWearableDTO } from "./dto/item/item.dto";
import { NewsDTO } from "./dto/news/news.dto";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

export const Api = {
  getMainNews: async (): Promise<NewsDTO> => {
    const res = await axiosInstance.get<NewsDTO>("/news");
    return res.data;
  },
  getItemConsumable: async (consumableType?: string): Promise<ItemsConsumableDTO> => {
    const res = await axiosInstance.get<ItemsConsumableDTO>("/item/consumable", {
      params: { consumableType },
    });
    return res.data;
  },
  getItemWeapon: async (wearableType?: string): Promise<ItemsWearableDTO> => {
    const res = await axiosInstance.get<ItemsWearableDTO>("/item/weapon", {
      params: { wearableType },
    });
    return res.data;
  },
  getItemArmor: async (wearableType?: string): Promise<ItemsWearableDTO> => {
    const res = await axiosInstance.get<ItemsWearableDTO>("/item/armor", {
      params: { wearableType },
    });
    return res.data;
  },
  getMainRanking: async () => {
    const res = await axiosInstance.get("/rank");
    return res.data;
  },
  getRanking: async (seasonId: number, page: number) => {
    const res = await axiosInstance.get(`/rank/${seasonId}`, {
      params: { page },
    });
    return res.data;
  },
  updatedPlayer: async (userNum: number, nickname: string) => {
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
  getPlayerRecentData: async (nickname: string) => {
    try {
      const res = await axiosInstance.get(`/player/recent/${nickname}/23`);
      res.data.playerData.updated = new Date(res.data.playerData.updated);
      gameSetting(res.data.playerData.games);
      let nicknames = localStorage.getItem("nickname");
      if (nicknames) {
        nicknames = JSON.parse(nicknames);
        if (!nicknames.includes(nickname)) {
          localStorage.setItem("nickname", JSON.stringify([...nicknames, nickname]));
        }
      } else {
        localStorage.setItem("nickname", JSON.stringify([nickname]));
      }
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
  getPlayerPastData: async (userNum: number, next: number) => {
    const res = await axiosInstance.get(`/player/past/${userNum}`, {
      params: { next },
    });
    gameSetting(res.data.games);
    return res.data;
  },
  getGame: async (gameId: number) => {
    const res = await axiosInstance.get(`/game/${gameId}`);
    for (let player of res.data) {
      let equip = [];
      player.equipment = JSON.parse(player.equipment);
      for (let i = 0; i < 5; i++) {
        equip.push(player.equipment[`${i}`]);
      }
      player.equipment = equip;
    }
    let result = [];
    for (let i = 0; i < res.data.length; i += 3) {
      const team = res.data.slice(i, i + 3);
      result.push(team);
    }
    return result;
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

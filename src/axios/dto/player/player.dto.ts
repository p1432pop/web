import { GameDTO } from "../game/game.dto";

export class CharacterStats {
	characterCode: number;
	totalGames: number;
	wins: number;
	top3: number;
	averageKills: number;
	averageTeamKills: number;
	averageAssistants: number;
	averageHunts: number;
	averageRank: number;
	averageGainVFCredit: number;
}
export class PlayerData {
	nickname: string;
	view: ViewStatus;
	userNum: number;
	games: GameDTO[];
	accountLevel?: number;
	characterCode?: number;
	mmr?: number;
	next?: number;
	updated?: string;
	rank?: number;
}

export class PlayerDTO {
	playerData: PlayerData;
	playerStats: CharacterStats[];
}

export enum ViewStatus {
	NEW = "NEW",
	OLD = "OLD",
}

export class topRank {
	userNum: number;
	nickname: string;
	mmr: number;
	totalGames: number;
	top1: number;
	top3: number;
	averageRank: number;
	averageKills: number;
	characterStats: CharacterStat[];
}

export class CharacterStat {
	characterCode: number;
	totalGames: number;
	wins: number;
	top3: number;
}

export class RankDTO {
	topRanks: topRank[];
	updated: string;
}

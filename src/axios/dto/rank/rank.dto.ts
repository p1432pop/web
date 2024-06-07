export class topRank {
	userNum: number;
	nickname: string;
	mmr: number;
	totalGames: number;
	top1: number;
	top3: number;
	averageRank: number;
	averageKills: number;
	characterCode1: number;
	charTotal1: number;
	characterCode2: number | null;
	charTotal2: number | null;
	characterCode3: number | null;
	charTotal3: number | null;
}

export class RankDTO {
	topRanks: topRank[];
	updated: string;
}

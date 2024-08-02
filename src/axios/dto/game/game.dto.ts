export class Equipment {
	"0"?: number;
	"1"?: number;
	"2"?: number;
	"3"?: number;
	"4"?: number;
	[key: number]: number | undefined;
}

export class GameDTO {
	userNum: number;
	nickname: string;
	gameId: number;
	versionMajor: number;
	versionMinor: number;
	isRank: boolean;
	characterNum: number;
	characterLevel: number;
	gameRank: number;
	playerKill: number;
	playerAssistant: number;
	monsterKill: number;
	equipment: Equipment;
	startDtm: string;
	duration: number;
	mmrBefore: number | null;
	mmrGain: number | null;
	mmrAfter: number | null;
	damageToPlayer: number;
	matchSize: number;
	teamKill: number;
	traitFirstCore: number;
	traitFirstSub: number[];
	traitSecondSub: number[];
	escapeState: number;
	tacticalSkillGroup: number;
	tacticalSkillLevel: number;
	totalGainVFCredit: number;
}

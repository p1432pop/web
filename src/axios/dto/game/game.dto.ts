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
	gameId: number;
	versionMajor: number;
	versionMinor: number;
	characterNum: number;
	characterLevel: number;
	gameRank: number;
	playerKill: number;
	playerAssistant: number;
	monsterKill: number;
	equipment: Equipment;
	startDtm: string;
	duration: number;
	mmrBefore: number;
	mmrGain: number;
	mmrAfter: number;
	victory: number;
	damageToPlayer: number;
	giveUp: number;
	matchSize: number;
	teamKill: number;
	accountLevel: number;
	traitFirstCore: number;
	traitFirstSub: number[];
	traitSecondSub: number[];
	escapeState: number;
	tacticalSkillGroup: number;
	tacticalSkillLevel: number;
	totalGainVFCredit: number;
}

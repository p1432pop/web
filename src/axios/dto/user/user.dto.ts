import { UserStatDTO } from "./userStat.dto";

export class UserDTO {
	userNum: number;
	nickname: string;
	updated: string | null;
	mmr: number | null;
	accountLevel: number | null;
	prevStats: UserStatDTO[][];
}

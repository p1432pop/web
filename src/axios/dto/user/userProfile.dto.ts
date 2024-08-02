import { UserDTO } from "./user.dto";
import { ViewStatus } from "./user.enum";
import { UserCharacterStat } from "./userCharacterStat.dto";
import { UserGamesDTO } from "./userGames.dto";

export class UserProfileDTO {
	user: UserDTO;
	view: ViewStatus;
	userGames: UserGamesDTO;
	normalGames: UserGamesDTO;
	rankGames: UserGamesDTO;
	characterCode: number;
	rank?: number;
	rankSize?: number;
	userStats: UserCharacterStat[];
}

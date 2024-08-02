import { GameDTO } from "../game/game.dto";

export class UserGamesDTO {
	games: GameDTO[];
	next?: number;
}

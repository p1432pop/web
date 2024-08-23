import { MatchingMode } from "../dto/user/user.enum";

export interface StatisticsQuery {
	version: string;
	matchingMode: MatchingMode;
	tier: string;
}

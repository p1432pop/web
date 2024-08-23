import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Button, styled } from "@mui/material";
import { useEffect, useState } from "react";
import AccordionExpandIcon from "./GameAccordion";
import { UserGamesDTO } from "../../../axios/dto/user/userGames.dto";
import { MatchingMode } from "../../../axios/dto/user/user.enum";
import { UserDTO } from "../../../axios/dto/user/user.dto";
import { Api } from "../../../axios/axios";

const MoreButton = styled(Button)(() => ({
	width: "100%",
	height: "40px",
	border: "1px #dbe0e4 solid",
	textAlign: "center",
	backgroundColor: "white",
}));

export default function GameTab({ user }: { user: UserDTO }) {
	const [tabValue, setTabValue] = useState(MatchingMode.ALL);
	const [userGames, setUserGames] = useState<UserGamesDTO>({ games: [] });
	const [rankGames, setRankGames] = useState<UserGamesDTO>({ games: [] });
	const [normalGames, setNormalGames] = useState<UserGamesDTO>({ games: [] });
	useEffect(() => {
		const setup = async () => {
			console.log(user);
			const [_userGames, _normalGames, _rankGames] = await Promise.all([Api.getUserGames({ userNum: user.userNum }), Api.getUserGames({ userNum: user.userNum, isRank: false }), Api.getUserGames({ userNum: user.userNum, isRank: true })]);
			setUserGames(_userGames);
			setNormalGames(_normalGames);
			setRankGames(_rankGames);
		};
		setup();
	}, []);

	const handleTabChange = (event: React.SyntheticEvent, newValue: MatchingMode) => {
		setTabValue(newValue);
	};

	const moreHandler = async (matchingMode: MatchingMode) => {
		if (user) {
			if (matchingMode === "ALL") {
				const result = await Api.getUserGames({ userNum: user.userNum, next: userGames.next });
				setUserGames({ games: [...userGames.games, ...result.games], next: result.next });
			}
			if (matchingMode === "RANK") {
				const result = await Api.getUserGames({ userNum: user.userNum, next: userGames.next, isRank: true });
				setRankGames({ games: [...rankGames.games, ...result.games], next: result.next });
			}
			if (matchingMode === "NORMAL") {
				const result = await Api.getUserGames({ userNum: user.userNum, next: userGames.next, isRank: false });
				setNormalGames({ games: [...normalGames.games, ...result.games], next: result.next });
			}
		}
	};

	return (
		<Box sx={{ width: "100%", typography: "body1" }}>
			<TabContext value={tabValue}>
				<Box sx={{ border: 1, borderColor: "divider", backgroundColor: "white" }}>
					<TabList onChange={handleTabChange}>
						<Tab label="전체" value={MatchingMode.ALL} />
						<Tab label="랭크" value={MatchingMode.RANK} />
						<Tab label="일반" value={MatchingMode.NORMAL} />
					</TabList>
				</Box>
				<TabPanel sx={{ padding: "0" }} value={MatchingMode.ALL}>
					{userGames.games.map((game, index) => (
						<AccordionExpandIcon game={game} key={index} />
					))}
					{userGames.next ? <MoreButton onClick={() => moreHandler(tabValue)}>더보기</MoreButton> : null}
				</TabPanel>
				<TabPanel sx={{ padding: "0" }} value={MatchingMode.RANK}>
					{rankGames.games.map((game, index) => (
						<AccordionExpandIcon game={game} key={index} />
					))}
					{rankGames.next ? <MoreButton onClick={() => moreHandler(tabValue)}>더보기</MoreButton> : null}
				</TabPanel>
				<TabPanel sx={{ padding: "0" }} value={MatchingMode.NORMAL}>
					{normalGames.games.map((game, index) => (
						<AccordionExpandIcon game={game} key={index} />
					))}
					{normalGames.next ? <MoreButton onClick={() => moreHandler(tabValue)}>더보기</MoreButton> : null}
				</TabPanel>
			</TabContext>
		</Box>
	);
}

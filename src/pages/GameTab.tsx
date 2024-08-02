import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Button, styled } from "@mui/material";
import { useState } from "react";

import AccordionExpandIcon from "./GameAccordion";
import { UserGamesDTO } from "../axios/dto/user/userGames.dto";
import { MatchingMode } from "../axios/dto/user/user.enum";

interface GameTabProps {
	moreHandler: (matchingMode: MatchingMode) => void;
	userGames: UserGamesDTO;
	rankGames: UserGamesDTO;
	normalGames: UserGamesDTO;
}

const MoreButton = styled(Button)(() => ({
	width: "100%",
	height: "40px",
	border: "1px #dbe0e4 solid",
	textAlign: "center",
	backgroundColor: "white",
}));

export default function GameTab({ moreHandler, userGames, rankGames, normalGames }: GameTabProps) {
	const [tabValue, setTabValue] = useState(MatchingMode.ALL);
	const handleTabChange = (event: React.SyntheticEvent, newValue: MatchingMode) => {
		setTabValue(newValue);
		console.log(newValue);
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
					{userGames.games.map((game) => (
						<AccordionExpandIcon game={game} />
					))}
					{userGames.next ? <MoreButton onClick={() => moreHandler(tabValue)}>더보기</MoreButton> : null}
				</TabPanel>
				<TabPanel sx={{ padding: "0" }} value={MatchingMode.RANK}>
					{rankGames.games.map((game) => (
						<AccordionExpandIcon game={game} />
					))}
					{rankGames.next ? <MoreButton onClick={() => moreHandler(tabValue)}>더보기</MoreButton> : null}
				</TabPanel>
				<TabPanel sx={{ padding: "0" }} value={MatchingMode.NORMAL}>
					{normalGames.games.map((game) => (
						<AccordionExpandIcon game={game} />
					))}
					{normalGames.next ? <MoreButton onClick={() => moreHandler(tabValue)}>더보기</MoreButton> : null}
				</TabPanel>
			</TabContext>
		</Box>
	);
}

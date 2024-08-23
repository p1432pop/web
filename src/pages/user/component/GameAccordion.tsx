import Accordion from "@mui/material/Accordion";
import AccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Api } from "../../../axios/axios";
import { Equipment, GameDTO } from "../../../axios/dto/game/game.dto";
import { Avatar, Badge, Divider, DividerProps, LinearProgress, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses } from "@mui/material";
import styles from "../Player.module.css";
import Loading from "../../../components/Loading";

const CustomAccordionSummary = styled((props: AccordionSummaryProps) => (
	<AccordionSummary
		expandIcon={
			<ExpandMoreIcon
				sx={{
					pointerEvents: "auto",
				}}
			/>
		}
		{...props}
	/>
))(() => ({
	pointerEvents: "none",
	".MuiAccordionSummary-content": { margin: "0px" },
	".MuiAccordionSummary-content.Mui-expanded": { margin: "0px" },
	borderRadius: "4px",
}));

const CustomAccordion = styled(Accordion)(() => ({
	"&.Mui-expanded": { margin: "8px 0px" },
	"&.Mui-expanded:first-of-type": { margin: "8px 0px" },
	"&::before": { display: "none" },
	border: "1px solid",
	borderColor: "rgba(0, 0, 0, 0.12)",
	margin: "8px 0px",
	borderRadius: "4px",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
		textAlign: "center",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 16,
		textAlign: "center",
		padding: "0px",
	},
}));

const SmallAvatar = styled(Avatar)(() => ({ width: "28px", height: "28px" }));
const CustomDivider = styled((props: DividerProps) => <Divider orientation="vertical" sx={{ height: "inherit" }} {...props} />)(() => ({}));
const CustomDiv = styled("div")(() => ({ display: "flex", flexDirection: "column", rowGap: "16px", flex: 1 }));
const BoldDiv = styled("div")(() => ({ fontWeight: "bold" }));

export default function AccordionExpandIcon({ game }: { game: GameDTO }) {
	const [data, setData] = useState<GameDTO[][]>();
	const [isLoaded, setIsLoaded] = useState(false);
	const [maxDamage, setMaxDamage] = useState(0);
	const handle = async (event: React.SyntheticEvent, expanded: boolean) => {
		if (expanded && !isLoaded) {
			const result = await Api.getGame(game.gameId);
			await new Promise((resolve) => setTimeout(resolve, 500));
			let max = 0;
			result.forEach((team) => {
				team.forEach((player) => {
					if (max < player.damageToPlayer) {
						max = player.damageToPlayer;
					}
				});
			});
			setMaxDamage(max);
			setData(result);
			setIsLoaded(true);
		}
	};
	return (
		<CustomAccordion onChange={handle}>
			<CustomAccordionSummary sx={{ backgroundColor: AccordionColor(game.gameRank) }}>
				<div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", color: "#34414D", gap: "16px" }}>
					<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", flex: 0.7 }}>
						<div>
							<BoldDiv style={{ color: GameModeColor(game.gameRank) }}>{GameMode(game.isRank)}</BoldDiv>
							<BoldDiv>#{game.gameRank}</BoldDiv>
						</div>
						<Divider orientation="horizontal" />
						<div>
							<div>
								{Math.floor(game.duration / 60)}분 {game.duration % 60}초
							</div>
							<div>{calTime(game.startDtm, game.duration)}</div>
						</div>
					</div>
					<div style={{ display: "flex", flexDirection: "column", rowGap: "4px", flex: 1 }}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<div>
								<Badge
									overlap="circular"
									anchorOrigin={{
										vertical: "bottom",
										horizontal: "right",
									}}
									badgeContent={<Avatar className={styles.smallAvatar}>{game.characterLevel}</Avatar>}
								>
									<Avatar className={styles.avatarChar} alt="img" src={`https://lumia.kr/image/CharacterIcon/${game.characterNum}.png`} />
								</Badge>
							</div>
							<div className={styles.traitBox}>
								<SmallAvatar src={`https://lumia.kr/image/Trait/${game.traitFirstCore}.png`} />
								<SmallAvatar src={`https://lumia.kr/image/Trait/${game.traitFirstSub[0]}.png`} />
								<SmallAvatar src={`https://lumia.kr/image/Trait/${game.traitFirstSub[1]}.png`} />
								<Badge
									overlap="circular"
									anchorOrigin={{
										vertical: "bottom",
										horizontal: "right",
									}}
									badgeContent={<Avatar className={styles.smallAvatar}>{game.tacticalSkillLevel}</Avatar>}
								>
									<SmallAvatar src={`https://lumia.kr/image/Tactical/${game.tacticalSkillGroup}.png`} />
								</Badge>
								<SmallAvatar src={`https://lumia.kr/image/Trait/${game.traitSecondSub[0]}.png`} />
								<SmallAvatar src={`https://lumia.kr/image/Trait/${game.traitSecondSub[1]}.png`} />
							</div>
						</div>
						<div className={styles.itemBox}>{itemImg(game.equipment)}</div>
					</div>
					<CustomDiv>
						<div>TK / K / A</div>
						<BoldDiv>
							{game.teamKill} / {game.playerKill} / {game.playerAssistant}
						</BoldDiv>
					</CustomDiv>
					<CustomDiv>
						<div>킬관여</div>
						<BoldDiv>{killInvolve(game)}%</BoldDiv>
					</CustomDiv>
					<CustomDiv>
						<div>피해량</div>
						<BoldDiv>{game.damageToPlayer}</BoldDiv>
					</CustomDiv>
					<CustomDiv>
						<div>크레딧</div>
						<BoldDiv>{game.totalGainVFCredit}</BoldDiv>
					</CustomDiv>
					{game.isRank ? (
						<CustomDiv>
							<div>RP</div>
							<BoldDiv style={{ display: "flex" }}>
								{game.mmrAfter}
								{game.mmrGain! > 0 ? <ExpandLessIcon className={styles.redIcon} /> : game.mmrGain! < 0 ? <ExpandMoreIcon className={styles.blueIcon} /> : <ExpandLessIcon className={styles.blackIcon} />}
								{Math.abs(game.mmrGain!)}
							</BoldDiv>
						</CustomDiv>
					) : (
						<CustomDiv>
							<div>야생동물</div>
							<BoldDiv>{game.monsterKill}</BoldDiv>
						</CustomDiv>
					)}
				</div>
			</CustomAccordionSummary>
			{data ? (
				<AccordionDetails sx={{ padding: "0px" }}>
					<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", textAlign: "center", height: "48px" }}>
						<Typography>
							게임 ID : {game.gameId} (v1.{game.versionMajor}.{game.versionMinor})
						</Typography>
						<CustomDivider />
						<Typography>게임 시작 : {new Date(game.startDtm).toLocaleString()}</Typography>
						<CustomDivider />
						<Typography>게임 종료 : {getEndTime(game.startDtm, game.duration)}</Typography>
					</div>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<StyledTableCell>#</StyledTableCell>
									<StyledTableCell>플레이어</StyledTableCell>
									<StyledTableCell>Trait/Tactical</StyledTableCell>
									<StyledTableCell>TK / K / A</StyledTableCell>
									<StyledTableCell>딜량</StyledTableCell>
									<StyledTableCell>크레딧</StyledTableCell>
									<StyledTableCell>아이템</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map((team) => (
									<TableRow sx={{ backgroundColor: teamColor(team, game.userNum) }}>
										<StyledTableCell>#{team[0].gameRank}</StyledTableCell>
										<StyledTableCell>
											<div style={{ display: "flex", flexDirection: "column", alignItems: "left", justifyContent: "center", height: "160px" }}>
												{team.map((player) => (
													<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
														<Badge
															overlap="circular"
															anchorOrigin={{
																vertical: "bottom",
																horizontal: "right",
															}}
															badgeContent={<Avatar className={styles.smallAvatar2}>{player.characterLevel}</Avatar>}
														>
															<Avatar className={styles.avatarChar2} alt="img" src={`https://lumia.kr/image/CharacterIcon/${player.characterNum}.png`} />
														</Badge>
														<Link component={RouterLink} color={"black"} underline="hover" to={`/players/${player.nickname}`}>
															{player.nickname}
														</Link>
													</div>
												))}
											</div>
										</StyledTableCell>
										<StyledTableCell>
											<div className={styles.cellBox}>
												{team.map((player) => (
													<div className={styles.cellItem}>
														<Avatar alt="img" src={`https://lumia.kr/image/Trait/${player.traitFirstCore}.png`} />
														<Badge
															overlap="circular"
															anchorOrigin={{
																vertical: "bottom",
																horizontal: "right",
															}}
															badgeContent={<Avatar className={styles.smallAvatar2}>{player.tacticalSkillLevel}</Avatar>}
														>
															<Avatar alt="img" src={`https://lumia.kr/image/Tactical/${player.tacticalSkillGroup}.png`} />
														</Badge>
													</div>
												))}
											</div>
										</StyledTableCell>
										<StyledTableCell>
											<div className={styles.cellBox}>
												{team.map((player) => (
													<div className={styles.cellItem}>
														{player.teamKill} / {player.playerKill} / {player.playerAssistant}
													</div>
												))}
											</div>
										</StyledTableCell>
										<StyledTableCell>
											<div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "160px" }}>
												{team.map((player) => (
													<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", width: "100%", height: "33%" }}>
														<div>{player.damageToPlayer}</div>
														<LinearProgress color="secondary" variant="determinate" value={progressValue(player.damageToPlayer, maxDamage)}></LinearProgress>
													</div>
												))}
											</div>
										</StyledTableCell>
										<StyledTableCell>
											<div className={styles.cellBox}>
												{team.map((player) => (
													<div className={styles.cellItem}>{player.totalGainVFCredit}</div>
												))}
											</div>
										</StyledTableCell>
										<StyledTableCell>
											<div className={styles.cellBox}>
												{team.map((player) => (
													<div className={styles.cellItem}>{itemImg(player.equipment)}</div>
												))}
											</div>
										</StyledTableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</AccordionDetails>
			) : (
				<Loading />
			)}
		</CustomAccordion>
	);
}

const AccordionColor = (gameRank: number): string => {
	if (gameRank === 1) return "#D4E4FE";
	return "#FFEEEE";
};
const GameModeColor = (gameRank: number): string => {
	if (gameRank === 1) return "#4171D6";
	return "#D31A45";
};
const teamColor = (team: GameDTO[], userNum: number): string => {
	for (let player of team) {
		if (player.userNum === userNum) {
			return "#fff9c4";
		}
	}
	return "white";
};
const GameMode = (isRank: boolean): string => {
	if (isRank) return "랭크";
	return "일반";
};
const getEndTime = (startDtm: string, duration: number): string => {
	let date = new Date(startDtm);
	let endTime = new Date(date.getTime() + duration * 1000);
	return endTime.toLocaleString();
};
const calTime = (startDtm: string, duration: number): string => {
	const now = new Date();
	const start = new Date(startDtm);
	const time = Math.floor((now.getTime() - start.getTime() - duration * 1000) / 1000);
	const [minute, hour, day] = [60, 3600, 86400];
	if (time < minute) {
		return `${Math.floor(time)}초 전`;
	}
	if (time < hour) {
		return `${Math.floor(time / minute)}분 전`;
	}
	if (time < day) {
		return `${Math.floor(time / hour)}시간 전`;
	}
	return `${Math.floor(time / day)}일 전`;
};
const itemImg = (equipment: Equipment) => {
	let codes: (number | undefined)[] = [];
	let imgs: JSX.Element[] = [];
	for (let i = 0; i < 5; i++) {
		codes.push(equipment[i]);
	}
	codes.forEach((item) => {
		if (item) {
			imgs.push(<img className={styles.itemImg} alt="img" src={`https://lumia.kr/image/Icon/${item}.png`} />);
		} else {
			imgs.push(<img alt="img" />);
		}
	});
	return imgs;
};
const killInvolve = (game: GameDTO): number => {
	const { teamKill, playerKill, playerAssistant } = game;
	if (teamKill === 0) return 0;
	return Math.floor(((playerKill + playerAssistant) / teamKill) * 100);
};
const progressValue = (damageToPlayer: number, maxDamage: number): number => {
	return (damageToPlayer * 100) / maxDamage;
};

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import styles from "../style/Player.module.css";
import "../App.css";

import { getTierImg, getTierName } from "../utils/tier";

import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TableContainer from "@mui/material/TableContainer";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { Api } from "../axios/axios";

export default function Player(props) {
	const [loading, setLoading] = useState(true);
	const [moreLoading, setMoreLoading] = useState(false);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [status, setStatus] = useState();
	const [page, setPage] = useState(1);
	const [playerData, setPlayerData] = useState();
	const [playerStats, setPlayerStats] = useState();
	const [open, setOpen] = useState(false);
	const [userGames, setUserGames] = useState([]);
	const params = useParams();
	useEffect(() => {
		setLoading(true);
		const setup = async () => {
			const result = await Api.getPlayerRecentData(params.nickname);
			setLoading(false);
			setStatus(result.status);
			if (result.status === 200) {
				setPlayerData(result.data.playerData);
				setPlayerStats(result.data.playerStats);
			}
		};
		setup();
	}, [params]);
	const moreHandler = async () => {
		const result = await Api.getPlayerPastData(playerData.userNum, playerData.next);
		setMoreLoading(false);
		setPlayerData({
			...playerData,
			games: [...playerData.games, ...result.games],
			next: result.next,
		});
	};
	const moreHandler2 = () => {
		setMoreLoading(true);
		moreHandler();
	};
	const updateHanlder = async () => {
		const result = await Api.updatedPlayer(playerData.userNum, playerData.nickname);
		setUpdateLoading(false);
		setStatus(result.status);
		if (result.status === 200) {
			setPlayerData(result.data.playerData);
			setPlayerStats(result.data.playerStats);
		}
	};
	const updateHandler2 = () => {
		setUpdateLoading(true);
		updateHanlder();
	};
	const pageHandler = (event, newPage) => {
		setPage(newPage);
	};
	const openModal = async (gameId) => {
		const result = await Api.getGame(gameId);
		setUserGames(result);
		setOpen(true);
	};
	const closeModal = () => {
		setUserGames([]);
		setOpen(false);
	};
	const itemImg = (list) => {
		let arr = [];
		list.forEach((item) => {
			arr.push(<img className={styles.itemImg} alt="img" src={`../image/Icon/${item}.png`} />);
		});
		return arr;
	};
	const calTime = (startDtm, duration) => {
		let now = new Date();
		now.setTime(now.getTime() + 1000);
		let start = new Date(startDtm);
		let time = now - start - duration * 1000;
		if (time < 60 * 1000) {
			return `${parseInt(time / 1000)}초 전`;
		}
		if (time < 60 * 60 * 1000) {
			return `${parseInt(time / 1000 / 60)}분 전`;
		}
		if (time < 24 * 60 * 60 * 1000) {
			return `${parseInt(time / 1000 / 60 / 60)}시간 전`;
		}
		return `${parseInt(time / 1000 / 60 / 60 / 24)}일 전`;
	};
	const calTime2 = () => {
		if (playerData.updated instanceof Date && !isNaN(playerData.updated)) {
			let now = new Date();
			now.setTime(now.getTime() + 1000);
			let time = now - playerData.updated;
			if (time < 60 * 1000) {
				return `${parseInt(time / 1000)}초 전`;
			}
			if (time < 60 * 60 * 1000) {
				return `${parseInt(time / 1000 / 60)}분 전`;
			}
			if (time < 24 * 60 * 60 * 1000) {
				return `${parseInt(time / 1000 / 60 / 60)}시간 전`;
			}
			return `${parseInt(time / 1000 / 60 / 60 / 24)}일 전`;
		}
		return "기록 없음";
	};
	const getTime = (startDtm, duration) => {
		let date = new Date(startDtm);
		let time_zone = 9 * 60 * 60 * 1000;
		date.setTime(date.getTime() + duration * 1000 + time_zone);
		return date.toISOString().replace("T", " ").slice(0, -5);
	};
	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white,
			textAlign: "center",
			fontWeight: 600,
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 16,
			textAlign: "center",
			fontWeight: 600,
		},
	}));
	const winRate = () => {
		let count = 0;
		for (let game of playerData.games) {
			if (game.victory === 1) {
				count++;
			}
		}
		return parseInt((count / playerData.games.length) * 100);
	};
	const totalGame = () => {
		let count = 0;
		let total = playerData.games.length;
		for (let game of playerData.games) {
			if (game.victory === 1) {
				count++;
			}
		}
		return `${total}전 ${count}승 ${total - count}패`;
	};
	const winLose = () => {
		let count = 0;
		if (playerData.games) {
			for (let game of playerData.games) {
				if (game.victory === 1) {
					count++;
				}
			}
			return [
				{
					value: count,
					color: "blue",
				},
				{ value: playerData.games.length - count, color: "red" },
			];
		}
		return [];
	};
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		"&:last-child td, &:last-child th": {
			border: 0,
		},
	}));

	const size = {
		width: 190,
		height: 160,
	};

	const StyledText = styled("text")(({ theme }) => ({
		fill: theme.palette.text.primary,
		textAnchor: "middle",
		dominantBaseline: "central",
		fontSize: 20,
	}));

	function PieCenterLabel({ children }) {
		const { width, height, left, top } = useDrawingArea();
		return (
			<StyledText x={left + width / 2} y={top + height / 2}>
				{children}
			</StyledText>
		);
	}
	if (loading) return <Loading />;
	if (status === 200)
		return (
			<div>
				<div className={styles.profile}>
					{playerData.characterCode ? <img alt="img" src={`../image/CharacterIcon/${playerData.characterCode}.png`} /> : <AccountCircleIcon style={{ fontSize: "160px" }}></AccountCircleIcon>}
					<div className={styles.profileContent}>
						<Chip label={`레벨 : ${playerData.accountLevel | 0}`} variant="outlined" />
						<div className={styles.nickname}>{params.nickname}</div>
						{playerData.view === "OLD" ? (
							updateLoading ? (
								<CircularProgress />
							) : (
								<Button onClick={updateHandler2} variant="outlined">
									갱신 가능
								</Button>
							)
						) : (
							<Button className={styles.notAllowedButton} variant="outlined">
								갱신 불가
							</Button>
						)}
						최근 갱신 시간 : {calTime2()}
					</div>
					<div style={{ margin: "auto" }}>정규 시즌 3에 대한 정보만 제공합니다.</div>
					<img className={styles.avatarTier} src={"../" + getTierImg(playerData.mmr, playerData.rank)} alt="img" />
					<div className={styles.dataBox}>
						<div>{playerData.mmr >= 0 ? `${playerData.mmr}RP` : "기록 없음"}</div>
						<div>{getTierName(playerData.mmr, playerData.rank)}</div>
					</div>
				</div>
				<div className={styles.flexCenter}>
					{totalGame()}
					<PieChart series={[{ data: [...winLose()], innerRadius: 60 }]} {...size}>
						<PieCenterLabel>{winRate() + "%"}</PieCenterLabel>
					</PieChart>
				</div>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} size="" aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>실험체</TableCell>
								<TableCell align="left">게임수</TableCell>
								<TableCell align="left">승률</TableCell>
								<TableCell align="left">top3</TableCell>
								<TableCell align="left">TK</TableCell>
								<TableCell align="left">K</TableCell>
								<TableCell align="left">A</TableCell>
								<TableCell align="left">야생동물</TableCell>
								<TableCell align="left">평균 순위</TableCell>
								<TableCell align="left">크레딧</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{playerStats.slice((page - 1) * 5, page * 5).map((row) => (
								<TableRow key={row.characterCode} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<TableCell>
										<Avatar style={{ border: "1px solid black" }} src={`../image/CharacterIcon/${row.characterCode}.png`} />
									</TableCell>
									<TableCell align="left">{row.totalGames}</TableCell>
									<TableCell align="left">{((row.wins / row.totalGames) * 100).toFixed(2)}%</TableCell>
									<TableCell align="left">{((row.top3 / row.totalGames) * 100).toFixed(2)}%</TableCell>
									<TableCell align="left">{row.averageTeamKills}</TableCell>
									<TableCell align="left">{row.averageKills}</TableCell>
									<TableCell align="left">{row.averageAssistants}</TableCell>
									<TableCell align="left">{row.averageHunts}</TableCell>
									<TableCell align="left">#{row.averageRank}</TableCell>
									<TableCell align="left">{row.averageGainVFCredit}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Pagination className={styles.flexCenter} count={Math.ceil(playerStats.length / 5)} variant="outlined" page={page} shape="rounded" size="large" onChange={pageHandler} />
				<div>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<StyledTableCell>순위</StyledTableCell>
									<StyledTableCell>실험체</StyledTableCell>
									<StyledTableCell>Trait/Tactical</StyledTableCell>
									<StyledTableCell>TK / K / A</StyledTableCell>
									<StyledTableCell>딜량</StyledTableCell>
									<StyledTableCell>RP</StyledTableCell>
									<StyledTableCell>아이템</StyledTableCell>
									<StyledTableCell>플레이</StyledTableCell>
									<StyledTableCell>더보기</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{playerData.games.map((game, idx) => (
									<StyledTableRow
										key={idx}
										sx={{
											"&:last-child td, &:last-child th": { border: 0 },
										}}
									>
										<StyledTableCell>#{game.gameRank}</StyledTableCell>
										<StyledTableCell>
											<Badge
												overlap="circular"
												anchorOrigin={{
													vertical: "bottom",
													horizontal: "right",
												}}
												badgeContent={<Avatar className={styles.smallAvatar}>{game.characterLevel}</Avatar>}
											>
												<Avatar className={styles.avatarChar} alt="img" src={`../image/CharacterIcon/${game.characterNum}.png`} />
											</Badge>
										</StyledTableCell>
										<StyledTableCell>
											<div className={styles.traitBox}>
												<Avatar alt="img" src={`../image/Trait/${game.traitFirstCore}.png`} />
												<Avatar alt="img" src={`../image/Trait/${game.traitFirstSub[0]}.png`} />
												<Avatar alt="img" src={`../image/Trait/${game.traitFirstSub[1]}.png`} />
												<Avatar alt="img" src={`../image/Trait/${game.traitSecondSub[0]}.png`} />
												<Avatar alt="img" src={`../image/Trait/${game.traitSecondSub[1]}.png`} />
												<Badge
													overlap="circular"
													anchorOrigin={{
														vertical: "bottom",
														horizontal: "right",
													}}
													badgeContent={<Avatar className={styles.smallAvatar}>{game.tacticalSkillLevel}</Avatar>}
												>
													<Avatar alt="img" src={`../image/Tactical/${game.tacticalSkillGroup}.png`} />
												</Badge>
											</div>
										</StyledTableCell>
										<StyledTableCell>
											{game.teamKill} / {game.playerKill} / {game.playerAssistant}
										</StyledTableCell>
										<StyledTableCell>{game.damageToPlayer}</StyledTableCell>
										<StyledTableCell>
											<div className={styles.flexCenter}>
												{game.mmrAfter}
												{game.mmrGain > 0 ? <ExpandLessIcon className={styles.redIcon} /> : game.mmrGain < 0 ? <ExpandMoreIcon className={styles.blueIcon} /> : <ExpandLessIcon className={styles.blackIcon} />}
												{Math.abs(game.mmrGain)}
											</div>
										</StyledTableCell>
										<StyledTableCell>
											<div className={styles.itemBox}>{itemImg(game.equipment)}</div>
										</StyledTableCell>
										<StyledTableCell>
											{parseInt(game.duration / 60)}:{game.duration % 60}
											<br />
											<Tooltip title={getTime(game.startDtm, game.duration)}>{calTime(game.startDtm, game.duration)}</Tooltip>
										</StyledTableCell>
										<StyledTableCell onClick={() => openModal(game.gameId)}>+</StyledTableCell>
									</StyledTableRow>
								))}
							</TableBody>
							{open ? (
								<Modal open={open} onClose={closeModal}>
									<Box className="modal">
										<Table>
											<TableHead>
												<TableRow>
													<StyledTableCell>#</StyledTableCell>
													<StyledTableCell>실험체</StyledTableCell>
													<StyledTableCell>Trait/Tactical</StyledTableCell>
													<StyledTableCell>TK / K / A</StyledTableCell>
													<StyledTableCell>딜량</StyledTableCell>
													<StyledTableCell>크레딧</StyledTableCell>
													<StyledTableCell>아이템</StyledTableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{userGames.map((team, idx) => (
													<StyledTableRow>
														<StyledTableCell>#{team[0].gameRank}</StyledTableCell>
														<StyledTableCell>
															<div className={styles.cellBox}>
																{team.map((player, idx2) => (
																	<Badge
																		overlap="circular"
																		anchorOrigin={{
																			vertical: "bottom",
																			horizontal: "right",
																		}}
																		badgeContent={<Avatar className={styles.smallAvatar2}>{player.characterLevel}</Avatar>}
																	>
																		<Avatar className={styles.avatarChar2} alt="img" src={`../image/CharacterIcon/${player.characterNum}.png`} />
																	</Badge>
																))}
															</div>
														</StyledTableCell>
														<StyledTableCell>
															<div className={styles.cellBox}>
																{team.map((player, idx2) => (
																	<div className={styles.cellItem}>
																		<Avatar alt="img" src={`../image/Trait/${player.traitFirstCore}.png`} />
																		<Badge
																			overlap="circular"
																			anchorOrigin={{
																				vertical: "bottom",
																				horizontal: "right",
																			}}
																			badgeContent={<Avatar className={styles.smallAvatar2}>{player.tacticalSkillLevel}</Avatar>}
																		>
																			<Avatar alt="img" src={`../image/Tactical/${player.tacticalSkillGroup}.png`} />
																		</Badge>
																	</div>
																))}
															</div>
														</StyledTableCell>
														<StyledTableCell>
															<div className={styles.cellBox}>
																{team.map((player, idx2) => (
																	<div className={styles.cellItem}>
																		{player.teamKill} / {player.playerKill} / {player.playerAssistant}
																	</div>
																))}
															</div>
														</StyledTableCell>
														<StyledTableCell>
															<div className={styles.cellBox}>
																{team.map((player, idx2) => (
																	<div className={styles.cellItem}>{player.damageToPlayer}</div>
																))}
															</div>
														</StyledTableCell>
														<StyledTableCell>
															<div className={styles.cellBox}>
																{team.map((player, idx2) => (
																	<div className={styles.cellItem}>{player.totalGainVFCredit}</div>
																))}
															</div>
														</StyledTableCell>
														<StyledTableCell>
															<div className={styles.cellBox}>
																{team.map((player, idx2) => (
																	<div className={styles.cellItem}>{itemImg(player.equipment)}</div>
																))}
															</div>
														</StyledTableCell>
													</StyledTableRow>
												))}
											</TableBody>
										</Table>
									</Box>
								</Modal>
							) : null}
						</Table>
					</TableContainer>{" "}
					{playerData.next ? (
						moreLoading ? (
							<div className={styles.more}>
								<CircularProgress />
							</div>
						) : (
							<div className={styles.more}>
								<IconButton onClick={moreHandler2}>
									<AddIcon />
								</IconButton>
							</div>
						)
					) : null}
				</div>
			</div>
		);
	if (status === 404)
		return (
			<div className={styles.container}>
				<div className={styles.flexCenter}>
					<div className={styles.content}>
						<div className={styles.nicknameBox}>{params.nickname}</div>
						해당 닉네임의 플레이어를 찾을 수 없습니다.<br></br>
						다시 검색해 주세요.
					</div>
				</div>
			</div>
		);
	return <></>;
}

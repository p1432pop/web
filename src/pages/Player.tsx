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
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Pagination from "@mui/material/Pagination";
import { Api } from "../axios/axios";
import GameTab from "./GameTab";
import PlayerNotFound from "./PlayerNotFound";
import { Card, Tooltip } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../components/CustomTable";
import { CharacterStat } from "../axios/dto/rank/rank.dto";
import { UserCharacterStat } from "../axios/dto/user/userCharacterStat.dto";
import { MatchingMode, ViewStatus } from "../axios/dto/user/user.enum";
import { UserProfileDTO } from "../axios/dto/user/userProfile.dto";
import { GameDTO } from "../axios/dto/game/game.dto";
import { UserDTO } from "../axios/dto/user/user.dto";
import { UserGamesDTO } from "../axios/dto/user/userGames.dto";
import { UserStatDTO } from "../axios/dto/user/userStat.dto";

export default function Player() {
	const [loading, setLoading] = useState(true);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [status, setStatus] = useState(404);
	const [page, setPage] = useState(1);
	const [user, setUser] = useState<UserDTO>();
	const [characterCode, setCharacterCode] = useState<number>();
	const [view, setView] = useState<ViewStatus>(ViewStatus.OLD);
	const [rank, setRank] = useState<number>();
	const [rankSize, setRankSize] = useState<number>();
	const [userGames, setUserGames] = useState<UserGamesDTO>({ games: [] });
	const [rankGames, setRankGames] = useState<UserGamesDTO>({ games: [] });
	const [normalGames, setNormalGames] = useState<UserGamesDTO>({ games: [] });
	const [userCharacterStats, setUserCharacterStats] = useState<UserCharacterStat[]>([]);
	const params = useParams();

	useEffect(() => {
		setLoading(true);
		const setup = async () => {
			if (params.nickname) {
				const result = await Api.getUserProfile(params.nickname);
				setLoading(false);
				setStatus(result.code);
				setPage(1);
				if (result.data) {
					setUser(result.data.user);
					setCharacterCode(result.data.characterCode);
					setView(result.data.view);
					setRank(result.data.rank);
					setRankSize(result.data.rankSize);
					setUserGames(result.data.userGames);
					setRankGames(result.data.rankGames);
					setNormalGames(result.data.normalGames);
					setUserCharacterStats(result.data.userStats);
				}
			}
		};
		setup();
	}, [params]);

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

	const updateHanlder = async () => {
		if (user) {
			const result = await Api.updatedPlayer(user.userNum, user.nickname, user.updated);
			setUpdateLoading(false);
			setStatus(result.code);
			setPage(1);
			if (result.data) {
				setUser(result.data.user);
				setCharacterCode(result.data.characterCode);
				setView(result.data.view);
				setRank(result.data.rank);
				setRankSize(result.data.rankSize);
				setUserGames(result.data.userGames);
				setRankGames(result.data.rankGames);
				setNormalGames(result.data.normalGames);
				setUserCharacterStats(result.data.userStats);
			}
		}
	};

	const updateHandler2 = () => {
		setUpdateLoading(true);
		updateHanlder();
	};

	const pageHandler = (event: React.ChangeEvent<unknown>, newPage: number) => {
		setPage(newPage);
	};

	const calPastTime = (updated: string | null) => {
		if (updated) {
			let now = new Date();
			let updatedTime = new Date(updated);
			let time = now.getTime() - updatedTime.getTime();
			if (time < 60 * 1000) {
				return `${Math.floor(time / 1000)}초 전`;
			}
			if (time < 60 * 60 * 1000) {
				return `${Math.floor(time / 1000 / 60)}분 전`;
			}
			if (time < 24 * 60 * 60 * 1000) {
				return `${Math.floor(time / 1000 / 60 / 60)}시간 전`;
			}
			return `${Math.floor(time / 1000 / 60 / 60 / 24)}일 전`;
		}
		return "기록 없음";
	};

	const title = (season: number) => {
		if (season >= 19) {
			return `S${Math.floor(season / 2) - 8}`;
		} else {
			return `EA_S${Math.floor(season / 2) + 1}`;
		}
	};

	const content = (matchingTeamMode: number): string => {
		if (matchingTeamMode === 1) return "솔로";
		if (matchingTeamMode === 2) return "듀오";
		return "스쿼드";
	};
	if (loading) return <Loading />;
	if (status === 200 && user)
		return (
			<Card sx={{ backgroundColor: "#eeeeee", padding: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
				<Card style={{ display: "flex", backgroundColor: "#eeeeee" }}>
					{characterCode ? <img src={`https://lumia.kr/image/CharacterIcon/${characterCode}.png`} /> : <AccountCircleIcon style={{ fontSize: "160px" }}></AccountCircleIcon>}
					<div className={styles.profileContent}>
						<Chip label={`레벨 : ${user.accountLevel || 0}`} variant="outlined" />
						<div className={styles.nickname}>{params.nickname}</div>
						{view === "OLD" ? (
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
						최근 갱신 시간 : {calPastTime(user.updated)}
					</div>
					<div style={{ flex: 1 }}>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
							{user.prevStats.map((seasonData: UserStatDTO[]) => {
								return (
									<Tooltip
										title={seasonData.map((item) => {
											return (
												<div>
													{content(item.matchingTeamMode)} : {item.mmr}
												</div>
											);
										})}
									>
										<Chip
											size="small"
											variant="outlined"
											label={
												<>
													{title(seasonData[0].seasonId)} : {seasonData[0].mmr}
												</>
											}
											sx={{ color: "red", fontSize: "12px" }}
										/>
									</Tooltip>
								);
							})}
						</div>
					</div>
					<img className={styles.avatarTier} src={getTierImg(user.mmr!, rank)} alt="img" />
					<div className={styles.dataBox}>
						<div>{user.mmr ? `${user.mmr}RP` : "기록 없음"}</div>
						<div>{getTierName(user.mmr!, rank)}</div>
					</div>
				</Card>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<StyledTableRow>
								<StyledTableCell>실험체</StyledTableCell>
								<StyledTableCell>게임수</StyledTableCell>
								<StyledTableCell>승률</StyledTableCell>
								<StyledTableCell>top3</StyledTableCell>
								<StyledTableCell>TK</StyledTableCell>
								<StyledTableCell>K</StyledTableCell>
								<StyledTableCell>A</StyledTableCell>
								<StyledTableCell>야생동물</StyledTableCell>
								<StyledTableCell>평균 순위</StyledTableCell>
								<StyledTableCell>크레딧</StyledTableCell>
							</StyledTableRow>
						</TableHead>
						<TableBody>
							{userCharacterStats.slice((page - 1) * 5, page * 5).map((row) => (
								<StyledTableRow key={row.characterCode}>
									<StyledTableCell sx={{ margin: "auto" }}>
										<Avatar style={{ border: "1px solid black", margin: "auto" }} src={`https://lumia.kr/image/CharacterIcon/${row.characterCode}.png`} />
									</StyledTableCell>
									<StyledTableCell>{row.totalGames}</StyledTableCell>
									<StyledTableCell>{((row.wins / row.totalGames) * 100).toFixed(2)}%</StyledTableCell>
									<StyledTableCell>{((row.top3 / row.totalGames) * 100).toFixed(2)}%</StyledTableCell>
									<StyledTableCell>{row.averageTeamKills}</StyledTableCell>
									<StyledTableCell>{row.averageKills}</StyledTableCell>
									<StyledTableCell>{row.averageAssistants}</StyledTableCell>
									<StyledTableCell>{row.averageHunts}</StyledTableCell>
									<StyledTableCell>#{row.averageRank}</StyledTableCell>
									<StyledTableCell>{row.averageGainVFCredit}</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Pagination className={styles.flexCenter} count={Math.ceil(userCharacterStats.length / 5)} variant="outlined" page={page} shape="rounded" size="large" onChange={pageHandler} />
				<GameTab moreHandler={moreHandler} userGames={userGames} rankGames={rankGames} normalGames={normalGames} />
			</Card>
		);
	if (status === 404) return <PlayerNotFound nickname={params.nickname!} />;
	return <></>;
}

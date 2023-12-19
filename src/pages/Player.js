import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadPlayer, loadGame, updatePlayer, setOpen } from "../app/playerSlice";

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
export default function Player(props) {
	const value = useSelector((state) => state.player);
	const params = useParams();
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(loadPlayer(params.nickname));
	}, [params, dispatch]);
	const openModal = (gameId) => {
		dispatch(loadGame(gameId));
	};
	const closeModal = () => {
		dispatch(setOpen());
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
		if (value.updated instanceof Date && !isNaN(value.updated)) {
			let now = new Date();
			now.setTime(now.getTime() + 1000);
			let time = now - value.updated;
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
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		"&:last-child td, &:last-child th": {
			border: 0,
		},
	}));
	if (value.onload) {
		if (value.status === 200) {
			return (
				<div>
					<div className={styles.profile}>
						{value.characterCode !== 0 ? <img alt="img" src={`../image/CharacterIcon/${value.characterCode}.png`} /> : <AccountCircleIcon style={{ fontSize: "160px" }}></AccountCircleIcon>}
						<div className={styles.profileContent}>
							<Chip label={`레벨 : ${value.level}`} variant="outlined" />
							<div className={styles.nickname}>{params.nickname}</div>
							{value.view === 2 || value.view === 3 ? (
								value.updateLoading ? (
									<CircularProgress />
								) : (
									<Button
										onClick={() => {
											console.log(value.userNum);
											dispatch(
												updatePlayer({
													nickname: params.nickname,
													userNum: value.userNum,
													updated: value.updated,
												})
											);
										}}
										variant="outlined"
									>
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
						<div style={{ margin: "auto" }}>정규 시즌 2에 대한 정보만 제공합니다.</div>
						<img className={styles.avatarTier} src={"../" + getTierImg(value.mmr, value.rank)} alt="img" />
						<div className={styles.dataBox}>
							<div>{value.mmr >= 0 ? `${value.mmr}RP` : "기록 없음"}</div>
							<div>{getTierName(value.mmr, value.rank)}</div>
						</div>
					</div>
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
									{value.games.map((game, idx) => (
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
								{value.open ? (
									<Modal open={value.open} onClose={closeModal}>
										<Box className="modal">
											<Table>
												<TableHead>
													<TableRow>
														<StyledTableCell>#</StyledTableCell>
														<StyledTableCell>실험체</StyledTableCell>
														<StyledTableCell>Trait/Tactical</StyledTableCell>
														<StyledTableCell>플레이어</StyledTableCell>
														<StyledTableCell>TK / K / A</StyledTableCell>
														<StyledTableCell>딜량</StyledTableCell>
														<StyledTableCell>크레딧</StyledTableCell>
														<StyledTableCell>아이템</StyledTableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{value.userGames.map((team, idx) => (
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
																		<div className={styles.cellItem}>{player.nickname}</div>
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
						</TableContainer>
					</div>
				</div>
			);
		} else if (value.status === 404) {
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
		}
	}
	return (
		<div className={styles.container}>
			<CircularProgress />
			{params.nickname}
			플레이어를 검색하고 있습니다. 잠시만 기다려 주세요.
		</div>
	);
}

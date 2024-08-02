import { useState } from "react";
import { Equipment, GameDTO } from "../axios/dto/game/game.dto";
import { Api } from "../axios/axios";
import { Avatar, Badge, Box, Modal, Table, TableBody, TableCell, TableHead, TableRow, styled, tableCellClasses } from "@mui/material";
import styles from "../style/Player.module.css";

interface ModalProps {
	open: boolean;
	userGames: GameDTO[][];
	modalHandler: () => void;
}
export default function GameModal({ open, userGames, modalHandler }: ModalProps) {
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

	const itemImg = (equipment: Equipment) => {
		let codes: (number | undefined)[] = [];
		let imgs: JSX.Element[] = [];
		for (let i = 0; i < 5; i++) {
			codes.push(equipment[i]);
		}
		codes.forEach((item) => {
			if (item) {
				imgs.push(<img className={styles.itemImg} alt="img" src={`../image/Icon/${item}.png`} />);
			} else {
				imgs.push(<img alt="img" />);
			}
		});
		return imgs;
	};

	if (open)
		return (
			<Modal open={open} onClose={modalHandler}>
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
							{userGames.map((team) => (
								<StyledTableRow>
									<StyledTableCell>#{team[0].gameRank}</StyledTableCell>
									<StyledTableCell>
										<div className={styles.cellBox}>
											{team.map((player) => (
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
											{team.map((player) => (
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
											{team.map((player) => (
												<div className={styles.cellItem}>
													{player.teamKill} / {player.playerKill} / {player.playerAssistant}
												</div>
											))}
										</div>
									</StyledTableCell>
									<StyledTableCell>
										<div className={styles.cellBox}>
											{team.map((player) => (
												<div className={styles.cellItem}>{player.damageToPlayer}</div>
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
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</Modal>
		);
	return null;
}

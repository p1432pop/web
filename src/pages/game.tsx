import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, Badge, Avatar, Tooltip, Modal, Box, TableCell, styled, tableCellClasses } from "@mui/material";
import { Equipment, GameDTO } from "../axios/dto/game/game.dto";
import styles from "../style/Player.module.css";
import GameModal from "./GameModal";
import { useState } from "react";
import { Api } from "../axios/axios";

export default function GameTable({ games }: { games: GameDTO[] }) {
	const [open, setOpen] = useState(false);
	const [userGames, setUserGames] = useState<GameDTO[][]>([]);
	const openModal = async (gameId: number) => {
		const result = await Api.getGame(gameId);
		setUserGames(result);
		setOpen(true);
	};
	const closeModal = () => {
		setUserGames([]);
		setOpen(false);
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
	const tableCellColor = (gameRank: number): string => {
		if (gameRank === 1) return "#D4E4FE";
		return "#FFEEEE";
	};
	const getTime = (startDtm: string, duration: number) => {
		let date = new Date(startDtm);
		let time_zone = 9 * 60 * 60 * 1000;
		date.setTime(date.getTime() + duration * 1000 + time_zone);
		return date.toISOString().replace("T", " ").slice(0, -5);
	};
	const calTime = (startDtm: string, duration: number) => {
		let now = new Date();
		now.setTime(now.getTime() + 1000);
		let start = new Date(startDtm);
		let time = now.getTime() - start.getTime() - duration * 1000;
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

	return (
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
					<TableBody style={{ borderColor: "black" }}>
						{games.map((game, idx) => (
							<TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} style={{ backgroundColor: tableCellColor(game.gameRank) }}>
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
										<Avatar className={styles.avatarChar} alt="img" src={`https://lumia.kr/image/CharacterIcon/${game.characterNum}.png`} />
									</Badge>
								</StyledTableCell>
								<StyledTableCell>
									<div className={styles.traitBox}>
										<Avatar alt="img" src={`https://lumia.kr/image/Trait/${game.traitFirstCore}.png`} />
										<Avatar alt="img" src={`https://lumia.kr/image/Trait/${game.traitFirstSub[0]}.png`} />
										<Avatar alt="img" src={`https://lumia.kr/image/Trait/${game.traitFirstSub[1]}.png`} />
										<Avatar alt="img" src={`https://lumia.kr/image/Trait/${game.traitSecondSub[0]}.png`} />
										<Avatar alt="img" src={`https://lumia.kr/image/Trait/${game.traitSecondSub[1]}.png`} />
										<Badge
											overlap="circular"
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "right",
											}}
											badgeContent={<Avatar className={styles.smallAvatar}>{game.tacticalSkillLevel}</Avatar>}
										>
											<Avatar alt="img" src={`https://lumia.kr/image/Tactical/${game.tacticalSkillGroup}.png`} />
										</Badge>
									</div>
								</StyledTableCell>
								<StyledTableCell>
									{game.teamKill} / {game.playerKill} / {game.playerAssistant}
								</StyledTableCell>
								<StyledTableCell>{game.damageToPlayer}</StyledTableCell>
								<StyledTableCell>
									{/* <div className={styles.flexCenter}>
										{game.mmrAfter}
										{game.mmrGain > 0 ? <ExpandLessIcon className={styles.redIcon} /> : game.mmrGain < 0 ? <ExpandMoreIcon className={styles.blueIcon} /> : <ExpandLessIcon className={styles.blackIcon} />}
                  {Math.abs(game.mmrGain)}
									</div> */}
								</StyledTableCell>
								<StyledTableCell>
									<div className={styles.itemBox}>{itemImg(game.equipment)}</div>
								</StyledTableCell>
								<StyledTableCell>
									{Math.floor(game.duration / 60)}:{game.duration % 60}
									<br />
									<Tooltip title={getTime(game.startDtm, game.duration)}>
										<div>{calTime(game.startDtm, game.duration)}</div>
									</Tooltip>
								</StyledTableCell>
								<StyledTableCell onClick={() => openModal(game.gameId)}>+</StyledTableCell>
							</TableRow>
						))}
					</TableBody>
					<GameModal open={open} userGames={userGames} modalHandler={closeModal} />
				</Table>
			</TableContainer>{" "}
			{/* {playerData.next ? (
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
    ) : null} */}
		</div>
	);
}

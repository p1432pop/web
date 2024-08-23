import { TableContainer, Paper, Table, TableHead, TableBody, Avatar, Pagination } from "@mui/material";
import { UserDTO } from "../../../axios/dto/user/user.dto";
import { StyledTableRow, StyledTableCell } from "../../../components/CustomTable";
import { useEffect, useState } from "react";
import { Api } from "../../../axios/axios";
import { UserCharacterStat } from "../../../axios/dto/user/userCharacterStat.dto";
import styles from "../Player.module.css";

export default function UserStat({ stat }: { stat: UserCharacterStat[] }) {
	const [page, setPage] = useState(1);

	const pageHandler = (event: React.ChangeEvent<unknown>, newPage: number) => {
		setPage(newPage);
	};

	return (
		<>
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
						{stat.slice((page - 1) * 5, page * 5).map((row) => (
							<StyledTableRow key={row.characterCode}>
								<StyledTableCell sx={{ margin: "auto" }}>
									<Avatar style={{ border: "1px solid black", margin: "auto" }} src={`https://lumia.kr/image/CharacterIcon/${row.characterCode}.png`} />
								</StyledTableCell>
								<StyledTableCell>{row.totalGames}</StyledTableCell>
								<StyledTableCell>{((row.wins / row.totalGames) * 100).toFixed(2)}%</StyledTableCell>
								<StyledTableCell>{((row.top3 / row.totalGames) * 100).toFixed(2)}%</StyledTableCell>
								<StyledTableCell>{row.averageTeamKills.toFixed(2)}</StyledTableCell>
								<StyledTableCell>{row.averageKills.toFixed(2)}</StyledTableCell>
								<StyledTableCell>{row.averageAssistants.toFixed(2)}</StyledTableCell>
								<StyledTableCell>{row.averageHunts.toFixed(1)}</StyledTableCell>
								<StyledTableCell>#{row.averageRank.toFixed(1)}</StyledTableCell>
								<StyledTableCell>{row.averageGainVFCredit}</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Pagination className={styles.flexCenter} count={Math.ceil(stat.length / 5)} variant="outlined" page={page} shape="rounded" size="large" onChange={pageHandler} />
		</>
	);
}

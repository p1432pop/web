import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Api } from "../../axios/axios";

import { getTierImg, getTierName } from "../../utils/tier";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import TableContainer from "@mui/material/TableContainer";

import styles from "./Ranking.module.css";
import Loading from "../../components/Loading";
import { topRank } from "../../axios/dto/rank/rank.dto";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import { BorderAvatar, MostCharacterImages } from "../../components/MostCharacterIcon";
import { TierBox } from "../../components/TierBox";

export default function Ranking() {
	const [seasonId, setSeasonId] = useState(25);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [ranking, setRanking] = useState<topRank[]>([]);
	const [updated, setUpdated] = useState(new Date());
	useEffect(() => {
		const setup = async () => {
			const result = await Api.getRanking(25, 1);
			setRanking(result.topRanks);
			setUpdated(new Date(result.updated));
			setLoading(false);
		};
		setup();
	}, []);
	const pageHandler = async (event: React.ChangeEvent<unknown>, value: number) => {
		const result = await Api.getRanking(seasonId, value);
		setRanking(result.topRanks);
		setUpdated(new Date(result.updated));
		setPage(value);
	};
	const seasonHandler = async (event: SelectChangeEvent<number>) => {
		const result = await Api.getRanking(event.target.value as number, 1);
		setSeasonId(event.target.value as number);
		setRanking(result.topRanks);
		setUpdated(new Date(result.updated));
		setPage(1);
	};

	const getTime = (time: Date) => {
		return time.toLocaleString();
	};
	const seasonMenu = () => {
		let arr = [];
		for (let i = 12; i >= 0; i--) {
			if (i >= 9) {
				arr.push(<MenuItem key={i} value={i * 2 + 1}>{`정규 시즌 ${i - 8}`}</MenuItem>);
			} else {
				arr.push(<MenuItem key={i} value={i * 2 + 1}>{`EA 시즌${i + 1}`}</MenuItem>);
			}
		}
		return arr;
	};
	const title = (season: number) => {
		if (season >= 19) {
			return `정규 시즌 ${Math.floor(season / 2) - 8}`;
		} else {
			return `EA 시즌 ${Math.floor(season / 2) + 1}`;
		}
	};
	if (loading) return <Loading />;
	return (
		<>
			<div>
				<div className={styles.topContent}>
					<div>
						{title(seasonId)} 랭킹 최근 업데이트 : {getTime(updated)}
					</div>
					<Box sx={{ width: 300 }}>
						<FormControl fullWidth>
							<Select defaultValue={25} onChange={seasonHandler}>
								{seasonMenu()}
							</Select>
						</FormControl>
					</Box>
				</div>
				<TableContainer className={styles.my} component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<StyledTableCell>순위</StyledTableCell>
								<StyledTableCell>플레이어</StyledTableCell>
								<StyledTableCell>티어</StyledTableCell>
								<StyledTableCell>RP</StyledTableCell>
								<StyledTableCell>승률</StyledTableCell>
								<StyledTableCell>TOP 3</StyledTableCell>
								<StyledTableCell>게임 수</StyledTableCell>
								<StyledTableCell>평균 순위</StyledTableCell>
								<StyledTableCell>평균 킬</StyledTableCell>
								<StyledTableCell>모스트 실험체</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{ranking.map((row, idx) => (
								<StyledTableRow key={idx}>
									<StyledTableCell>{(page - 1) * 100 + 1 + idx}</StyledTableCell>
									<StyledTableCell>
										<Link style={{ textDecoration: "none" }} to={`/players/${row.nickname}`}>
											{row.nickname}
										</Link>
									</StyledTableCell>
									<StyledTableCell>
										<TierBox>
											<BorderAvatar src={getTierImg(row.mmr, (page - 1) * 100 + 1 + idx)} />
											{getTierName(row.mmr, (page - 1) * 100 + 1 + idx)}
										</TierBox>
									</StyledTableCell>
									<StyledTableCell>{row.mmr >= 7000 ? row.mmr - 7000 : row.mmr % 250}</StyledTableCell>
									<StyledTableCell>{(row.top1 * 100).toFixed(1)}%</StyledTableCell>
									<StyledTableCell>{(row.top3 * 100).toFixed(1)}%</StyledTableCell>
									<StyledTableCell>{row.totalGames}</StyledTableCell>
									<StyledTableCell>#{row.averageRank.toFixed(1)}</StyledTableCell>
									<StyledTableCell>{row.averageKills.toFixed(2)}</StyledTableCell>
									<StyledTableCell>
										<MostCharacterImages codes={row.characterStats.map((characterStat) => characterStat.characterCode)} />
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Pagination className={styles.flexCenter} count={10} variant="outlined" page={page} shape="rounded" size="large" onChange={pageHandler} />
			</div>
		</>
	);
}

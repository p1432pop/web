import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { Avatar, Badge, Typography } from "@mui/material";
import { WeaponGroup } from "../../utils/WeaponGroup";
import { CharacterName } from "../../utils/CharacterName";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { MatchingMode } from "../../axios/dto/user/user.enum";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (a: { [key in Key]: number }, b: { [key in Key]: number }) => number {
	return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
	id: string;
	label: string;
}

const headCells: readonly HeadCell[] = [
	{ id: "index", label: "#" },
	{ id: "characterCode", label: "실험체" },
	{ id: "totalGames", label: "게임" },
	{ id: "mmrGain", label: "MMR 획득" },
	{ id: "winRate", label: "승률" },
	{ id: "top3Rate", label: "TOP 3" },
	{ id: "averageKills", label: "평균 킬" },
	{ id: "averageTeamKills", label: "평균 TK" },
	{ id: "averageHunts", label: "동물 사냥" },
	{ id: "averageDamageToPlayer", label: "피해량" },
	{ id: "averageRank", label: "평균 순위" },
];

const selectedColor = (orderBy: string, selected: string) => {
	if (orderBy === selected) return "#f5f5f5";
	else return "white";
};

interface EnhancedTableProps {
	order: Order;
	orderBy: string;
	matchingMode: MatchingMode;
	onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
}

function ExpandIcon(props: { mmrGain: number }) {
	if (props.mmrGain > 0) return <ExpandLessIcon sx={{ color: "red" }} />;
	if (props.mmrGain < 0) return <ExpandMoreIcon sx={{ color: "blue" }} />;
	return <ExpandLessIcon sx={{ color: "black" }} />;
}

interface EnhancedTableHeadLabelProps {
	headCell: HeadCell;
	order: Order;
	orderBy: string;
	matchingMode: MatchingMode;
	createSortHandler: (property: string) => (event: React.MouseEvent<unknown>) => void;
}

function EnhancedTableHeadLabel(props: EnhancedTableHeadLabelProps) {
	const { order, orderBy, createSortHandler, headCell, matchingMode } = props;
	if (headCell.id === "index") return <Typography>{headCell.label}</Typography>;
	if (headCell.id === "mmrGain" && matchingMode === MatchingMode.NORMAL) return null;
	return (
		<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
			{headCell.label}
			{orderBy === headCell.id ? (
				<Box component="span" sx={visuallyHidden}>
					{order === "desc" ? "sorted descending" : "sorted ascending"}
				</Box>
			) : null}
		</TableSortLabel>
	);
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, onRequestSort, matchingMode } = props;
	const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells
					.filter((headCell) => {
						if (headCell.id === "mmrGain" && matchingMode === MatchingMode.RANK) return true;
						if (headCell.id === "mmrGain" && matchingMode === MatchingMode.NORMAL) return false;
						else return true;
					})
					.map((headCell) => (
						<TableCell sx={{ fontSize: "12px", padding: "8px", backgroundColor: orderBy === headCell.id ? "#95c8f9" : "#e0eeee" }} key={headCell.id} align="center" sortDirection={orderBy === headCell.id ? order : false}>
							<EnhancedTableHeadLabel matchingMode={matchingMode} headCell={headCell} order={order} orderBy={orderBy} createSortHandler={createSortHandler} />
						</TableCell>
					))}
			</TableRow>
		</TableHead>
	);
}

export default function StatisticsTable({ stat, matchingMode }: { stat: any; matchingMode: MatchingMode }) {
	const [order, setOrder] = React.useState<Order>("desc");
	const [orderBy, setOrderBy] = React.useState<string>("totalGames");

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const data = stat.map((item: any) => {
		return {
			...item,
			winRate: (item.wins * 100) / item.totalGames,
			top3Rate: (item.top3 * 100) / item.totalGames,
		};
	});
	const visibleRows = React.useMemo(() => stableSort(data, getComparator(order, orderBy)), [order, orderBy, stat]);

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} size="medium">
						<EnhancedTableHead matchingMode={matchingMode} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
						<TableBody>
							{visibleRows.map((row, index) => (
								<TableRow tabIndex={-1} key={index} sx={{ fontSize: "12px" }}>
									<TableCell align="center" component="th" scope="row">
										{index + 1}
									</TableCell>
									<TableCell sx={{ backgroundColor: orderBy === "characterCode" ? "#f5f5f5" : "white" }}>
										<Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
											<Badge
												overlap="circular"
												anchorOrigin={{
													vertical: "bottom",
													horizontal: "right",
												}}
												badgeContent={<Avatar sx={{ backgroundColor: "black", width: "16px", height: "16px" }} src={`https://lumia.kr/image/WeaponGroup/${row.bestWeapon}.png`} />}
											>
												<Avatar sx={{ border: "1px solid black" }} src={`https://lumia.kr/image/CharacterIcon/${row.characterCode}.png`} />
											</Badge>
											<Typography>
												{WeaponGroup.get(row.bestWeapon)} {CharacterName.get(row.characterCode)}
											</Typography>
										</Box>
									</TableCell>
									<TableCell sx={{ backgroundColor: selectedColor(orderBy, "totalGames") }}>{row.totalGames}</TableCell>
									{matchingMode === MatchingMode.RANK ? (
										<TableCell sx={{ backgroundColor: selectedColor(orderBy, "mmrGain") }}>
											<Box display="flex" alignItems="center">
												<ExpandIcon mmrGain={row.mmrGain} />
												{Math.abs(row.mmrGain).toFixed(2)}
											</Box>
										</TableCell>
									) : null}
									<TableCell sx={{ backgroundColor: selectedColor(orderBy, "winRate") }}>{row.winRate.toFixed(2)}%</TableCell>
									<TableCell sx={{ backgroundColor: selectedColor(orderBy, "top3Rate") }}>{row.top3Rate.toFixed(2)}%</TableCell>
									<TableCell sx={{ backgroundColor: selectedColor(orderBy, "averageKills") }}>{row.averageKills.toFixed(2)}</TableCell>
									<TableCell sx={{ backgroundColor: selectedColor(orderBy, "averageTeamKills") }}>{row.averageTeamKills.toFixed(2)}</TableCell>
									<TableCell sx={{ backgroundColor: selectedColor(orderBy, "averageHunts") }}>{row.averageHunts.toFixed(2)}</TableCell>
									<TableCell sx={{ backgroundColor: selectedColor(orderBy, "averageDamageToPlayer") }}>{row.averageDamageToPlayer}</TableCell>
									<TableCell sx={{ backgroundColor: selectedColor(orderBy, "averageRank") }}>#{row.averageRank.toFixed(2)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Box>
	);
}

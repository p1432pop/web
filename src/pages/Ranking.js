import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Ranking(props) {
	const [data, setData] = useState([]);
	const [page, setPage] = useState();
	const [current, setCurrent] = useState();

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
		  backgroundColor: theme.palette.common.black,
		  color: theme.palette.common.white,
		},
		[`&.${tableCellClasses.body}`]: {
		  fontSize: 16,
		},
	  }));
	  
	  const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
		  backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		'&:last-child td, &:last-child th': {
		  border: 0,
		},
	  }));

	const handleChange = (event, value) => {
		setPage(value);
		setCurrent(data.slice((value-1)*100, value*100));
	}

	const tier = (mmr, idx) => {
		if (mmr >= 6000) {
			if (idx <= 200) {
				return '이터니티';
			}
			else if (idx <= 700) {
				return '데미갓';
			}
			else {
				return '미스릴';
			}
		}
		else if (mmr >= 5750) {
			return '다이아몬드 1';
		}
		else if (mmr >= 5500) {
			return '다이아몬드 2';
		}
		else if (mmr >= 5250) {
			return '다이아몬드 3';
		}
		else if (mmr >=5000) {
			return '다이아몬드 4';
		}
		else if (mmr >= 4750) {
			return '플래티넘 1';
		}
		else if (mmr >= 4500) {
			return '플래티넘 2';
		}
		else if (mmr >= 4250) {
			return '플래티넘 3';
		}
		else if (mmr >=4000) {
			return '플래티넘 4';
		}
		else if (mmr >= 3750) {
			return '골드 1';
		}
		else if (mmr >= 3500) {
			return '골드 2';
		}
		else if (mmr >= 3250) {
			return '골드 3';
		}
		else if (mmr >=3000) {
			return '골드 4';
		}
	}
	const tier_img = (mmr, idx) => {
		if (mmr >= 6000) {
			if (idx <= 200) {
				return 'image/tier/Immortal.png';
			}
			else if (idx <= 700) {
				return 'image/tier/Titan.png';
			}
			else {
				return 'image/tier/Mithril.png';
			}
		}
		else if (mmr >= 5000) {
			return 'image/tier/Diamond.png';
		}
		else if (mmr >= 4000) {
			return 'image/tier/Platinum.png';
		}
		else if (mmr >= 3000) {
			return 'image/tier/Gold.png';
		}
	}
	async function getRanking() {
		await axios.get('/rank').then((res) => {
			console.log(res.data);
			setData(res.data);
			setPage(1);
			setCurrent(res.data.slice(0, 100))
		});
	}
	return (
		<>
			{page ?
			<div>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<StyledTableCell align="center">순위</StyledTableCell>
								<StyledTableCell align="center">티어</StyledTableCell>
								<StyledTableCell align="center">플레이어</StyledTableCell>
								<StyledTableCell align="center">MMR</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{current.map((row, idx) => (
								<StyledTableRow
								key={idx}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<StyledTableCell align="center">{(page-1)*100+1+idx}</StyledTableCell>
									<StyledTableCell align="center">
										<div style={{alignItems: "center", display: "flex", justifyContent: "center"}}>
											<Avatar alt="img" src={tier_img(row.mmr, (page-1)*100+1+idx)} />{tier(row.mmr, (page-1)*100+1+idx)}
										</div>
									</StyledTableCell>
									<StyledTableCell align="center">{row.nickname}</StyledTableCell>
									<StyledTableCell align="center">{row.mmr%250}</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Pagination count={10} variant="outlined" shape="rounded" size="large" onChange={handleChange} />
			</div>
				:
				<button onClick={getRanking}>button1</button>
			}
		</>
	);
};
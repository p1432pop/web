import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { loadSeason, setPage } from '../rankSlice';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import styles from '../style/Ranking.module.css';

export default function Ranking(props) {
	const value = useSelector((state) => state.rank);
    const dispatch = useDispatch();
	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
		  	backgroundColor: theme.palette.common.black,
		  	color: theme.palette.common.white,
			textAlign: 'center'
		},
		[`&.${tableCellClasses.body}`]: {
		  	fontSize: 16,
			textAlign: 'center'
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

	const pageHandler = (event, value) => {
		dispatch(setPage(value));
	};
	const seasonHandler = (event) => {
		dispatch(loadSeason(event.target.value));
	};

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
		else if (mmr >= 2750) {
			return '실버 1';
		}
		else if (mmr >= 2500) {
			return '실버 2';
		}
		else if (mmr >= 2250) {
			return '실버 3';
		}
		else if (mmr >= 2000) {
			return '실버 4';
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
	const avatarImage = (code1, code2, code3) => {
		let arr = [];
		arr.push(<Avatar className={styles.mx} src={`image/CharacterIcon/${code1}.png`} />)
		if(code2 !== null) {
			arr.push(<Avatar className={styles.mx} src={`image/CharacterIcon/${code2}.png`} />)
		}
		if(code3 !== null) {
			arr.push(<Avatar className={styles.mx} src={`image/CharacterIcon/${code3}.png`} />)
		}
		return arr;
	}
	return (
		<>
			<div className={styles.container}>
				<div className={styles.topContent}>
					<div>정규시즌{value.season} 랭킹</div>
					<Box sx={{ width: 300 }}>
						<FormControl fullWidth>
							<Select
							defaultValue={2}
							onChange={seasonHandler}
							>
								<MenuItem value={2}>정규시즌2</MenuItem>
								<MenuItem value={1}>정규시즌1</MenuItem>
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
							{value.current.map((row, idx) => (
								<StyledTableRow
								key={idx}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<StyledTableCell>{(value.page-1)*100+1+idx}</StyledTableCell>
									<StyledTableCell>
										<Link style={{textDecoration: 'none'}} to={`/player/${row.nickname}`}>{row.nickname}</Link>
									</StyledTableCell>
									<StyledTableCell>
										<div className={styles.avatarBox}>
											<Avatar className={styles.mx} src={tier_img(row.mmr, (value.page-1)*100+1+idx)} />{tier(row.mmr, (value.page-1)*100+1+idx)}
										</div>
									</StyledTableCell>
									<StyledTableCell>{row.mmr >= 6000 ? row.mmr - 6000 : row.mmr%250}</StyledTableCell>
									<StyledTableCell>{(row.top1*100).toFixed(1)}%</StyledTableCell>
									<StyledTableCell>{(row.top3*100).toFixed(1)}%</StyledTableCell>
									<StyledTableCell>{row.totalGames}</StyledTableCell>
									<StyledTableCell>{(row.averageRank).toFixed(1)}</StyledTableCell>
									<StyledTableCell>{(row.averageKills).toFixed(2)}</StyledTableCell>
									<StyledTableCell>
										<div className={styles.avatarBox}>
											{avatarImage(row.characterCode1, row.characterCode2, row.characterCode3)}
										</div>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Pagination className={styles.flexCenter} count={10} variant="outlined" page={value.page} shape="rounded" size="large" onChange={pageHandler} />
			</div >
		</>
	);
};
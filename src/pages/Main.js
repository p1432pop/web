import React, { useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import {Link as MuiLink} from '@mui/material';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';

import SearchIcon from '@mui/icons-material/Search';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import AddIcon from '@mui/icons-material/Add';

import { getTierImg, getTierName } from '../utils/tier';

import styles from '../style/Main.module.css';

export default function Main(props) {
	const navigate = useNavigate();
	const value = useSelector((state) => state.rank);
	const nickname = useRef('');
	const patchNotes = () => {
		let arr = [];
		let Links = [
			{url: "https://playeternalreturn.com/posts/news/1545", text: "2023.11.09 - 1.8 패치노트"},
			{url: "https://playeternalreturn.com/posts/news/1515", text: "2023.10.26 - 1.7 패치노트"},
			{url: "https://playeternalreturn.com/posts/news/1480", text: "2023.10.12 - 1.6 패치노트"}
		]
		for (let i=0; i<Links.length; i++) {
			arr.push(<MuiLink key={i} href={Links[i].url} underline='none'>{Links[i].text}</MuiLink>);
		}
		return arr;
	}
	const inputBaseHandler = (ev) => {
		if(ev.key === 'Enter') {
			if (ev.target.value.trim().length === 0) {
				alert("공백 없이 입력해주세요.")
			}
			else {
				navigate(`/player/${ev.target.value}`);
			}
		}
	}
	const buttonHandler = () => {
		if (nickname.current.value.trim().length === 0) {
			alert("공백 없이 입력해주세요.")
		}
		else {
			navigate(`/player/${nickname.current.value}`);
		}
	}
	const avatarImage = (codes) => {
		let arr = [];
		codes.forEach((code, index) => {
			if(code) {
				arr.push(<Avatar key={index} className={styles.mx} src={`image/CharacterIcon/${code}.png`} />)
			}
		})
		return arr;
	}
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
	}));
	return (
		<div>
			<div className={styles.topContent}>
				<div className={styles.searchBox}>
					<InputBase className={styles.input}
						placeholder="플레이어 검색"
						onKeyDown={(ev) => inputBaseHandler(ev)}
						inputRef={nickname}
					/>
					<IconButton type="submit" onClick={buttonHandler}>
						<SearchIcon sx={{color:'black'}}/>
					</IconButton>
				</div>
			</div>
			<div className={styles.patchBox}>
				<Stack spacing={2}>
					<div>
						- 최근 패치 노트
					</div>
					<Stack direction="row" spacing={0.5}>
						<MuiLink href="https://playeternalreturn.com/posts/news/1582" underline='none'>2023.11.23 - 1.9 패치노트</MuiLink>
						<FiberNewIcon style={{height: '21px'}}/>
					</Stack>
					{patchNotes()}
				</Stack>
			</div>
			<div>
			<TableContainer className={styles.my} component={Paper}>
					<Table>
						<caption>
							<div className={styles.flexCenter}>
								<IconButton>
									<AddIcon />
								</IconButton>
								더 보기
							</div>
						</caption>
						<TableHead>
							<TableRow>
								<StyledTableCell>순위</StyledTableCell>
								<StyledTableCell>플레이어</StyledTableCell>
								<StyledTableCell>티어</StyledTableCell>
								<StyledTableCell>RP</StyledTableCell>
								<StyledTableCell>승률</StyledTableCell>
								<StyledTableCell>평균 순위</StyledTableCell>
								<StyledTableCell>평균 킬</StyledTableCell>
								<StyledTableCell>모스트 실험체</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{value.current.slice(0, 5).map((row, idx) => (
								<StyledTableRow
								key={idx}
								
								>
									<StyledTableCell>{(value.page-1)*100+1+idx}</StyledTableCell>
									<StyledTableCell>
										<RouterLink style={{textDecoration: 'none'}} to={`/player/${row.nickname}`}>{row.nickname}</RouterLink>
									</StyledTableCell>
									<StyledTableCell>
										<div className={styles.avatarBox}>
											<Avatar className={styles.mx} src={getTierImg(row.mmr, (value.page-1)*100+1+idx)} />{getTierName(row.mmr, (value.page-1)*100+1+idx)}
										</div>
									</StyledTableCell>
									<StyledTableCell>{row.mmr >= 6000 ? row.mmr - 6000 : row.mmr%250}</StyledTableCell>
									<StyledTableCell>{(row.top1*100).toFixed(1)}%</StyledTableCell>
									<StyledTableCell>#{(row.averageRank).toFixed(1)}</StyledTableCell>
									<StyledTableCell>{(row.averageKills).toFixed(2)}</StyledTableCell>
									<StyledTableCell>
										<div className={styles.avatarBox}>
											{avatarImage([row.characterCode1, row.characterCode2, row.characterCode3])}
										</div>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};
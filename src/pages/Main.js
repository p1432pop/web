import React from 'react';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

import SearchIcon from '@mui/icons-material/Search';
import FiberNewIcon from '@mui/icons-material/FiberNew';

import styles from '../style/Main.module.css';

export default function Main(props) {
	const navigate = useNavigate();
	const patchNotes = () => {
		let arr = [];
		let Links = [
			{url: "https://playeternalreturn.com/posts/news/1424", text: "1.4 패치 노트 보기"},
			{url: "https://playeternalreturn.com/posts/news/1381", text: "1.3 패치 노트 보기"},
			{url: "https://playeternalreturn.com/posts/news/1354", text: "1.2 패치 노트 보기"}
		]
		for (let i=0; i<Links.length; i++) {
			arr.push(<Link key={i} href={Links[i].url} underline='none'>{Links[i].text}</Link>);
		}
		return arr;
	}
	const onChange = (ev) => {
		if(ev.key === 'Enter') {
			navigate(`/player/${ev.target.value}`, {
				state: {
					nickname: ev.target.value
				}
			});
		}
	}
	return (
		<div className={styles.container}>
			<div className={styles.topContent}>
				<div className={styles.searchBox}>
					<InputBase className={styles.input}
						placeholder="플레이어 검색"
						onKeyDown={(ev) => onChange(ev)}
					/>
					<IconButton type="submit">
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
						<Link href="https://playeternalreturn.com/posts/news/1447" underline='none'>1.5 패치 노트 보기</Link>
						<FiberNewIcon style={{height: '21px'}}/>
					</Stack>
					{patchNotes()}
				</Stack>
			</div>
		</div>
	);
};
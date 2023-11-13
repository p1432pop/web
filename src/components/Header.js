import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link, useNavigate } from 'react-router-dom';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function Header(props) {
	const navigate = useNavigate();
	const headerButtons = () => {
		let arr = [];
		let Links = [
			{to: "/", text: "메인"},
			{to: "/ranking", text: "랭킹"},
			{to: "/guide", text: "가이드"},
			{to: "/statistics", text: "통계"},
			{to: "/routes", text: "루트"},
		]
		for (let i=0; i<Links.length; i++) {
			arr.push(<Button key={i} LinkComponent={Link} to={Links[i].to} sx={{m: 1, color: 'white', fontSize: '18px'}} size="large">{Links[i].text}</Button>);
		}
		return arr;
	}
    return (
		<div style={{backgroundColor: 'black', height: '64px', width: '100%', justifyContent: "center", display: 'flex'}}>
			<div style={{maxWidth: '1080px', width: '100%', alignItems: 'center', display: 'flex'}}>
				<Stack direction="row" spacing={2} width="100%">
					<Button LinkComponent={Link} to="/" sx={{m: 1, color: 'white', fontSize: '18px', textTransform: 'none'}} size="large">Lumia.kr</Button>
					{headerButtons()}
				</Stack>
				<Box sx={{display: 'flex', alignItems: 'center', width: 400, height: 50, backgroundColor: 'white'}}>
					<InputBase
						sx={{ml: 3, width: '100%'}}
						placeholder="플레이어 검색"
						inputProps={{'aria-label': '플레이어 검색'}}
						onKeyDown={(ev) => {
							if (ev.key === 'Enter') {
								navigate(`/player/${ev.target.value}`, {
									state: {
										nickname: ev.target.value
									}
								});
							}
						}}
					/>
					<IconButton type="submit" sx={{p: '10px'}} aria-label="search">
						<SearchIcon sx={{color:'black'}}/>
					</IconButton>
				</Box>
			</div>
		</div>
    );
};
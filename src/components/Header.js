import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

export default function Header(props) {
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
			arr.push(<Button key={i} LinkComponent={Link} to={Links[i].to} sx={{m: 1, color: 'white', fontSize: '24px'}} size="large">{Links[i].text}</Button>);
		}
		return arr;
	}
    return (
		<div style={{backgroundColor: 'black', height: '80px', minWidth: '620px'}}>
			<Stack style={{paddingTop: '11px', paddingLeft: '16px'}} direction="row" spacing={2}>
				<Button LinkComponent={Link} to="/" sx={{m: 1, color: 'white', fontSize: '24px', textTransform: 'none'}} size="large">Lumia.kr</Button>
				{headerButtons()}
			</Stack>
		</div>
    );
};
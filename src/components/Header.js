import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import styles from '../style/Header.module.css';

export default function Header(props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const headerButtons = () => {
		let arr = [];
		let Links = [
			{to: "/", text: "Lumia.kr"},
			{to: "/", text: "메인"},
			{to: "/ranking", text: "랭킹"},
			{to: "/guide", text: "가이드"},
			{to: "/statistics", text: "통계"}
		]
		for (let i=0; i<Links.length; i++) {
			arr.push(<Button className={styles.buttonContent} key={i} LinkComponent={Link} to={Links[i].to} size="large">{Links[i].text}</Button>);
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
			<div className={styles.containerContent}>
				<div className={styles.buttonBox}>
					{headerButtons()}
				</div>
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
		</div>
    );
};
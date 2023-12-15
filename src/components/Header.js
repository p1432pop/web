import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import styles from '../style/Header.module.css';

export default function Header(props) {
	const nickname = useRef('');
	const navigate = useNavigate();
	const headerButtons = () => {
		let arr = [];
		let Links = [
			{to: "/", text: "Lumia.kr"},
			{to: "/", text: "메인"},
			{to: "/ranking", text: "랭킹"},
			{to: "/guide", text: "가이드"},
			{to: "/statistics", text: "유저 찾기"}
		]
		for (let i=0; i<Links.length; i++) {
			arr.push(<Button className={styles.buttonContent} key={i} LinkComponent={Link} to={Links[i].to} size="large">{Links[i].text}</Button>);
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
    return (
		<div className={styles.container}>
			<div className={styles.containerContent}>
				<div className={styles.buttonBox}>
					{headerButtons()}
				</div>
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
		</div>
    );
};
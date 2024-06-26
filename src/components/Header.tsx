import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

import styles from "../style/Header.module.css";

export default function Header() {
	const [nickname, setNickname] = useState("");
	const navigate = useNavigate();
	const headerButtons = () => {
		let arr = [];
		let Links = [
			{ to: "/", text: "Lumia.kr" },
			{ to: "/", text: "메인" },
			{ to: "/ranking", text: "랭킹" },
			{ to: "/guide", text: "가이드" },
		];
		for (let i = 0; i < Links.length; i++) {
			arr.push(
				<Button className={styles.buttonContent} onClick={() => linkHandler(Links[i].to)} key={i} size="large">
					{Links[i].text}
				</Button>
			);
		}
		return arr;
	};
	const linkHandler = (to: string) => {
		navigate(to);
	};
	const keyDownHandler = (ev: React.KeyboardEvent<HTMLInputElement>) => {
		if (ev.key === "Enter") {
			buttonHandler();
		}
	};
	const inputChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(ev.target.value);
	};
	const buttonHandler = () => {
		if (nickname.trim().length === 0) {
			alert("공백 없이 입력해주세요.");
		} else {
			navigate(`/players/${nickname}`);
		}
	};
	return (
		<div className={styles.container}>
			<div className={styles.containerContent}>
				<div className={styles.buttonBox}>{headerButtons()}</div>
				<div className={styles.searchBox}>
					<InputBase className={styles.input} placeholder="플레이어 검색" onKeyDown={keyDownHandler} onChange={inputChangeHandler} />
					<IconButton type="submit" onClick={buttonHandler}>
						<SearchIcon sx={{ color: "black" }} />
					</IconButton>
				</div>
			</div>
		</div>
	);
}

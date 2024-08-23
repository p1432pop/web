import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Box, styled } from "@mui/material";

interface LinkItem {
	to: string;
	text: string;
}

const LinkItems: LinkItem[] = [
	{ to: "/", text: "Lumia.kr" },
	{ to: "/", text: "메인" },
	{ to: "/ranking", text: "랭킹" },
	{ to: "/statistics", text: "통계" },
	{ to: "/guide", text: "가이드" },
];

const ButtonBox = styled(Box)(() => ({
	display: "flex",
	width: "100%",
}));

const HeaderContainer = styled(Box)(() => ({
	backgroundColor: "black",
	height: "64px",
	width: "100%",
	minWidth: "1080px",
	display: "flex",
	justifyContent: "center",
}));

const HeaderContainerContent = styled(Box)(() => ({
	maxWidth: "1080px",
	width: "100%",
	alignItems: "center",
	display: "flex",
}));

const SearchBox = styled(Box)(() => ({
	display: "flex",
	alignItems: "center",
	width: "400px",
	height: "40px",
	padding: "4px",
	backgroundColor: "white",
}));

const InputField = styled(InputBase)(() => ({
	width: "100%",
	marginLeft: "16px",
}));

const LinkButton = styled(Button)(() => ({
	margin: "0px",
	marginRight: "16px",
	color: "white",
	textTransform: "none",
	fontSize: "18px",
}));

function HeaderMenu({ linkHandler }: { linkHandler: (to: string) => void }) {
	return (
		<ButtonBox>
			{LinkItems.map((linkItem, index) => {
				return (
					<LinkButton onClick={() => linkHandler(linkItem.to)} key={index}>
						{linkItem.text}
					</LinkButton>
				);
			})}
		</ButtonBox>
	);
}

export default function Header() {
	const [nickname, setNickname] = useState("");
	const navigate = useNavigate();

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
		<HeaderContainer>
			<HeaderContainerContent>
				<HeaderMenu linkHandler={linkHandler} />
				<SearchBox>
					<InputField placeholder="플레이어 검색" onKeyDown={keyDownHandler} onChange={inputChangeHandler} />
					<IconButton type="submit" onClick={buttonHandler}>
						<SearchIcon />
					</IconButton>
				</SearchBox>
			</HeaderContainerContent>
		</HeaderContainer>
	);
}

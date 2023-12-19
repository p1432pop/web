import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import FormControl from "@mui/material/FormControl";
import TableContainer from "@mui/material/TableContainer";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import styles from "../style/Community.module.css";
import "../App.css";

export default function Community(props) {
	const [titleError, setTitleError] = useState("");
	const [contentError, setContentError] = useState("");
	const [charError, setCharError] = useState("");
	const [open, setOpen] = useState(false);
	const [post, setPost] = useState({
		all: [],
		my: [],
	});
	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white,
			textAlign: "center",
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 16,
			textAlign: "center",
		},
	}));
	const getPosts = async () => {
		const result1 = await axios.get("/posts");
		const result2 = await axios.get(`/posts/${value.id}`);
		setPost({ all: result1.data, my: result2.data });
	};
	const getTime = (time) => {
		let date = new Date(time);
		let time_zone = 9 * 60 * 60 * 1000;
		date.setTime(date.getTime() + time_zone);
		return date.toISOString().replace("T", " ").slice(0, -5);
	};
	useEffect(() => {
		getPosts();
	}, []);
	const value = useSelector((state) => state.register);
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		"&:last-child td, &:last-child th": {
			border: 0,
		},
	}));
	const closeModal = () => {
		setOpen(false);
	};
	const openModal = () => {
		setOpen(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const title = data.get("title");
		const content = data.get("content");
		let count = 0;
		let arr = [];
		for (let i = 1; i <= 69; i++) {
			if (data.get(i)) {
				count++;
				arr.push(i);
			}
		}
		if (count < 1 || count > 3) setCharError("1 ~ 3개를 선택해주세요");
		else setCharError("");
		if (title.length === 0 || title.length > 50) setTitleError("1 ~ 50 글자");
		else setTitleError("");
		if (content.length === 0 || content.length > 50) setContentError("1 ~ 50 글자");
		else setContentError("");
		if (!(count < 1 || count > 3) && !(title.length === 0 || title.length > 50) && !(content.length === 0 || content.length > 50)) onhandlePost(value.id, title, content, arr, count);
	};
	const deletePost = async (num) => {
		const result = await axios.delete(`/posts/${num}`);
		getPosts();
		console.log("del");
	};
	const onhandlePost = async (id, title, content, arr, count) => {
		console.log(id, title, content);
		let char1 = arr[0];
		let char2 = null;
		let char3 = null;
		if (count === 2) {
			char2 = arr[1];
		}
		if (count === 3) {
			char2 = arr[1];
			char3 = arr[2];
		}
		const result = await axios.post("/posts", {
			member_id: id,
			title: title,
			content: content,
			char1: char1,
			char2: char2,
			char3: char3,
		});
		closeModal();
		getPosts();
	};
	const charCheckBox = () => {
		let arr = [];
		for (let i = 1; i <= 70; i++) {
			arr.push(<FormControlLabel key={i} control={<Checkbox name={i.toString()} />} label={<Avatar alt="img" src={`/image/CharacterIcon/${i}.png`}></Avatar>} />);
		}
		return arr;
	};
	const avatarImage = (codes) => {
		let arr = [];
		codes.forEach((code, index) => {
			if (code) {
				arr.push(<Avatar key={index} className={styles.mx} src={`image/CharacterIcon/${code}.png`} />);
			}
		});
		return arr;
	};
	return (
		<>
			<div className={styles.title}>전체글</div>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<StyledTableCell>no.</StyledTableCell>
							<StyledTableCell>글쓴이</StyledTableCell>
							<StyledTableCell style={{ width: "200px" }}>제목</StyledTableCell>
							<StyledTableCell style={{ width: "200px" }}>내용</StyledTableCell>
							<StyledTableCell>모스트 실험체</StyledTableCell>
							<StyledTableCell>게시일</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{post.all.map((row, idx) => (
							<StyledTableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								<StyledTableCell>{row.num}</StyledTableCell>
								<StyledTableCell>{row.member_id}</StyledTableCell>
								<StyledTableCell>{row.title}</StyledTableCell>
								<StyledTableCell>{row.content}</StyledTableCell>
								<StyledTableCell>
									<div className={styles.avatarBox}>{avatarImage([row.char1, row.char2, row.char3])}</div>
								</StyledTableCell>
								<StyledTableCell>{getTime(row.updated)}</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<div className={styles.title}>내가 쓴 글</div>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<StyledTableCell>no.</StyledTableCell>
							<StyledTableCell>글쓴이</StyledTableCell>
							<StyledTableCell style={{ width: "200px" }}>제목</StyledTableCell>
							<StyledTableCell style={{ width: "200px" }}>내용</StyledTableCell>
							<StyledTableCell>모스트 실험체</StyledTableCell>
							<StyledTableCell>게시일</StyledTableCell>
							<StyledTableCell>삭제</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{post.my.map((row, idx) => (
							<StyledTableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								<StyledTableCell>{row.num}</StyledTableCell>
								<StyledTableCell>{row.member_id}</StyledTableCell>
								<StyledTableCell>{row.title}</StyledTableCell>
								<StyledTableCell>{row.content}</StyledTableCell>
								<StyledTableCell>
									<div className={styles.avatarBox}>{avatarImage([row.char1, row.char2, row.char3])}</div>
								</StyledTableCell>
								<StyledTableCell>{getTime(row.updated)}</StyledTableCell>
								<StyledTableCell>
									<IconButton onClick={() => deletePost(row.num)}>
										<DeleteIcon sx={{ color: "black" }} />
									</IconButton>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Button onClick={openModal} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} size="large">
				글쓰기
			</Button>
			{open ? (
				<Modal open={open} onClose={closeModal}>
					<Box className="modal">
						<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
							<FormControl component="fieldset" variant="standard">
								<TextField required fullWidth type="id" id="id" name="title" label="제목 ~ 50글자" error={titleError !== "" || false} />
								<TextField required fullWidth type="id" id="id" name="content" label="내용 ~ 100글자" error={contentError !== "" || false} />
								<FormGroup error={charError !== "" || false}>
									<Grid container spacing={3} sx={{ ml: 3, mt: 3 }}>
										{charCheckBox()}
									</Grid>
								</FormGroup>
								<FormHelperText>{charError}</FormHelperText>
								<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} size="large">
									글쓰기
								</Button>
							</FormControl>
						</Box>
					</Box>
				</Modal>
			) : null}
		</>
	);
}

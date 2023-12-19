import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setLogout, setWithdraw } from "../app/registerSlice";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import styles from "../style/SignUp.module.css";

import axios from "axios";

export default function SignIn(props) {
	const [signInError, setsignInError] = useState("");
	const value = useSelector((state) => state.register);
	const dispatch = useDispatch();
	const onhandlePost = async (data) => {
		const { id, password } = data;
		const result = await axios.post("/login", {
			id: id,
			password: password,
		});
		if (result.status === 404) {
			setsignInError("아이디 또는 비밀번호를 잘못 입력했습니다.");
		} else {
			console.log(id);
			dispatch(setLogin(id));
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();

		const data = new FormData(e.currentTarget);
		const joinData = {
			id: data.get("id"),
			password: data.get("password"),
		};
		const { id, password } = joinData;

		// 계정 유효성 체크
		const idRegex = /^(?=.*[a-z])(?=.*[0-9]).{5,20}$/;
		const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
		if (!idRegex.test(id) || !passwordRegex.test(password)) setsignInError("아이디 또는 비밀번호를 잘못 입력했습니다.");
		else setsignInError("");

		if (idRegex.test(id) && passwordRegex.test(password)) {
			onhandlePost(joinData);
		}
	};
	if (value.login) {
		return (
			<div>
				<Avatar src="" />
				<div>ID : {value.id}</div>
				<Button onClick={() => dispatch(setLogout())} type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1 }} size="large">
					로그아웃
				</Button>
				<Button onClick={() => dispatch(setWithdraw(value.id))} type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1 }} size="large">
					회원탈퇴
				</Button>
			</div>
		);
	} else {
		return (
			<Container component="main" maxWidth="xs">
				<div className={styles.formBox}>
					<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<FormHelperText>{signInError}</FormHelperText>
						<FormControl component="fieldset" variant="standard">
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField required autoFocus fullWidth type="id" id="id" name="id" label="아이디" />
								</Grid>
								<Grid item xs={12}>
									<TextField required fullWidth type="password" id="password" name="password" label="비밀번호" />
								</Grid>
							</Grid>
							<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} size="large">
								로그인
							</Button>
							<Grid item>
								<Link to="/signup">{"Don't have an account? Sign Up"}</Link>
							</Grid>
						</FormControl>
					</Box>
				</div>
			</Container>
		);
	}
}

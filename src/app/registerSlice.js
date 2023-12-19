import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const setWithdraw = createAsyncThunk("delete/account", (id) => {
	return axios.delete(`/member/${id}`);
});

export const registerSlice = createSlice({
	name: "register",
	initialState: {
		login: false,
		id: "",
	},
	// 리듀서
	reducers: {
		setLogin(state, action) {
			console.log(action);
			state.login = true;
			state.id = action.payload;
		},
		setLogout(state, action) {
			state.login = false;
			state.id = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(setWithdraw.pending, (state, action) => {})
			.addCase(setWithdraw.fulfilled, (state, action) => {
				state.login = false;
				state.id = "";
			})
			.addCase(setWithdraw.rejected, (state, action) => {
				state.login = false;
				state.id = "";
			});
	},
});

export const { setLogin, setLogout } = registerSlice.actions;

export default registerSlice.reducer;

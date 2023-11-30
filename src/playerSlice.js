import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const loadPlayer = createAsyncThunk(
    "load/Player",
    (nickname) => {
        return axios.get(`http://localhost:8080/play/${nickname}`);
    }
)
export const updatePlayer = createAsyncThunk(
    "update/Player",
    (nickname) => {
        return axios.get(`http://localhost:8080/updatePlay/${nickname}`)
    }
)

export const playerSlice = createSlice({
  name: "play",
  // 초깃값
  initialState: {
    data: 1,
    onload: false
  },
  // 리듀서
  reducers: {
    setOnload(state, action) {
      
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadPlayer.fulfilled, (state, action) => {
      //state.data = action.payload.data;
      console.log(action);
      onload = true
    })
  }
});

//export const {} = playerSlice.actions;

export default playerSlice.reducer;
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
  name: "player",
  // 초깃값
  initialState: {
    data: 1,
    loading: 0,
    onload: false,
    characterCode: 6,
    nickname: "아낌없이담는라면"
  },
  // 리듀서
  reducers: {
    setOnload(state, action) {
      
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadPlayer.fulfilled, (state, action) => {
      //state.data = action.payload.data;
      state.onload = true;
      state.loading = action.payload.status;
      console.log(action.payload.status);
      console.log(1);
    }).addCase(loadPlayer.rejected, (state, action) => {
      state.onload = true;
      console.log(action)
      state.loading = 404
    })
  }
});

//export const {} = playerSlice.actions;

export default playerSlice.reducer;
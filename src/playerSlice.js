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
    games: undefined,
    state: false,
    loading: 0,
    onload: false,
    characterCode: 6,
    nickname: "아낌없이담는라면",
    updated: new Date().toUTCString(),
    mmr: 4700,
    level: 0,
  },
  // 리듀서
  reducers: {
    setOnload(state, action) {
      
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadPlayer.fulfilled, (state, action) => {
      state.onload = true;
      state.loading = action.payload.status;
      state.state = action.payload.data.state;
      state.mmr = action.payload.data.data[0].mmrAfter;
      state.level = action.payload.data.data[0].accountLevel;
      state.updated = action.payload.data.updated;
      state.games = action.payload.data.data.slice(0, 20)
      for(let game of state.games) {
        let equip = []
        let obj = JSON.parse(game.equipment)
        for(let i=0; i<5; i++) {
          equip.push(obj[`${i}`])
        }
        game.equipment = equip
      }
    }).addCase(loadPlayer.rejected, (state, action) => {
      state.onload = true;
      console.log(action)
      state.loading = 404
    })
  }
});

//export const {} = playerSlice.actions;

export default playerSlice.reducer;
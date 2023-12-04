import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const loadPlayer = createAsyncThunk(
    "load/Player",
    (nickname) => {
        return axios.get(`/play/${nickname}`);
        
    }
)
export const updatePlayer = createAsyncThunk(
    "update/Player",
    (data) => {
        return axios.post(`/play`, {
          nickname: data.nickname,
          userNum: data.userNum,
          updated: data.updated
        })
    }
)
function gameSetting(state, data) {
    state.updated = new Date(data.updated);
    console.log(data.userNum, 'here')
    state.userNum = data.userNum;
    if (data.games.length !== 0) {
        state.mmr = data.games[0].mmrAfter;
        state.level = data.games[0].accountLevel;
        state.characterCode = data.games[0].characterNum
        state.games = data.games.slice(0, 20)
        for(let game of state.games) {
            let equip = []
            let obj = JSON.parse(game.equipment)
            for(let i=0; i<5; i++) {
                equip.push(obj[`${i}`])
            }
            game.equipment = equip
            game.traitFirstSub = JSON.parse(game.traitFirstSub)
            game.traitSecondSub = JSON.parse(game.traitSecondSub)
        }
    }
}
export const playerSlice = createSlice({
    name: "player",
    initialState: {
        games: [],
        view: 1,
        status: 200,
        onload: false,
        updateLoading: false,
        userNum: 0,
        characterCode: 0,
        updated: undefined,
        mmr: 0,
        level: 0,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadPlayer.pending, (state, action) => {
            state.games = [];
            state.view = 1;
            state.onload = false;
            state.updateLoading = false;
            state.userNum = 0;
            state.characterCode = 0;
            state.updated = undefined;
            state.mmr = 0;
            state.level = 0;
        })
        .addCase(loadPlayer.fulfilled, (state, action) => {
            state.status = action.payload.status
            state.onload = true;
            let data = action.payload.data;
            state.view = data.view;
            gameSetting(state, data)
        })
        .addCase(loadPlayer.rejected, (state, action) => {
            state.onload = true;
            console.log(action)
            state.status = 404
        })
        .addCase(updatePlayer.pending, (state, action) => {
            console.log(action, 'p');
            state.updateLoading = true;
        })
        .addCase(updatePlayer.fulfilled, (state, action) => {
            state.updateLoading = false;
            let data = action.payload.data;
            state.view = data.view;
            gameSetting(state, data)
        })
        .addCase(updatePlayer.rejected, (state, action) => {
            console.log(action, 'r');
        })      
    }
});

//export const {} = playerSlice.actions;

export default playerSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import rankReducer from "../rankSlice";
import playerReducer from "../playerSlice";
import registerReducer from "../registerSlice";
const store = configureStore({
  reducer: {
    rank: rankReducer,
    player: playerReducer,
    register: registerReducer
  }
});

export default store;
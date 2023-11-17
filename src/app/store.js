import { configureStore } from "@reduxjs/toolkit";
import rankReducer from "../rankSlice";

const store = configureStore({
  reducer: {
    rank: rankReducer
  }
});

export default store;
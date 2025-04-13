import {configureStore} from "@reduxjs/toolkit";
import guestifyReducer from "../features/guestifySlice.js";

export const store = configureStore({
    reducer: guestifyReducer
});
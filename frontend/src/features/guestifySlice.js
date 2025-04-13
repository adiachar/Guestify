import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user : {},
    headers: {},
    allRequests: [],
}

const guestifySlice = createSlice({
    name: "Guestify",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },

        setHeader: (state, action) => {
            state.headers = {
                authorization: `Bearer ${action.payload}`,
            }
        },

        setAllRequests: (state, action) => {
            state.allRequests = action.payload;
        }
    }
});

export const {
    setUser,
    setHeader,
} = guestifySlice.actions;

export default guestifySlice.reducer;
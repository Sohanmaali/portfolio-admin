import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // all dynamic keys will be stored here
};

export const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        set: (state, action) => {

            // merge whatever keys are in the action into state
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
        clearAll: (state) => {
            Object.keys(state).forEach((key) => delete state[key]);
        },
    },
});

export const { set, clearAll } = dataSlice.actions;
export default dataSlice.reducer;

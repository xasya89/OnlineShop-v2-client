import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import $api from "../http/api";

const initialState = {
    status: "",
    error: "",
    value: null
};

export const fetchShops = createAsyncThunk(
    "shop/fetchShops",
    async () => {
        const resp = await $api.get("/shops");
        return resp.data;
    }
)

export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        setShop: (state, action) => {
            state.value = action.payload
        }
    },
    extraReducers: {
        [fetchShops.fulfilled]: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const shopSelector = (state) => state.shop.value;

export const {setShop} = shopSlice.actions;
export default shopSlice.reducer;
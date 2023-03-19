import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import md5 from "md5"
import session from "redux-persist/lib/storage/session"
import api from '../http/api'

const initialState = {
    value: null,
    status: "loading",
    error: null
}

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async ({login, password, rememberMe}) => {
        password = md5(password).toUpperCase();
        var resp = await api.post("/login", { login, password});
        localStorage.setItem("user-remember", rememberMe);
        return resp.data;
    }
)

export const fetchUserByRefresh = createAsyncThunk(
    'user/fetchUser',
    async () => {
        var resp = await api.post("/refreshlogin");
        if(resp && resp.status===200)
            return resp.data;
        return resp.data;
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload;
        }
    },
    extraReducers: {
        [fetchUser.fulfilled]: (state, action) => {
            state.value = action.payload;
            sessionStorage.setItem("user-id",action.payload.token);
        },
        [fetchUser.rejected]: (state, action) => {
            state.status = "error";
            console.log("error");
        },
        [fetchUserByRefresh.fulfilled]: (state, action) => {
            state.value = action.payload;
            sessionStorage.setItem("user-id",action.payload.token);
        },
        [fetchUserByRefresh.rejected]: (state, action) => {
            state.status = "refresh-error";
            state.value = null;
        }
    }
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;


const selectUser = state => state.user.value;
export const selectorUser = createSelector(
    [selectUser], user => user
);
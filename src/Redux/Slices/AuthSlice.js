import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "Configs/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    username: localStorage.getItem('username') || '',
    token: localStorage.getItem('token') || '',
}

export const signup = createAsyncThunk("auth/signup", async (data) => {
    try {
        const response = axiosInstance.post("signup", data);
        toast.promise(response, {
            loading: 'Submitting form',
            success: 'Successfully signed up',
            error: 'Something went wrong'
        });
        return await response;
    } catch (error) {
        console.log(error);
        toast.error("Can not sign up, something went wrong");
    }
})

export const signin = createAsyncThunk("auth/signin", async (data) => {
    try {
        const response = axiosInstance.post("signin", data);
        toast.promise(response, {
            loading: 'Submitting form',
            success: 'Successfully signed in',
            error: 'Something went wrong'
        });
        return await response;
    } catch (error) {
        if(error?.response?.data?.err){
            toast.error(error?.response?.data?.err);
        }
        else{
            toast.error("Can not sign in, something went wrong");
        }
    }
})

const authSLice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false,
            state.token = '',
            state.username = '',
            localStorage.clear()
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signin.fulfilled, (state, action)=>{
            if(action?.payload?.data){
                const receivedData = action?.payload?.data?.data;
                state.isLoggedIn = (receivedData !== undefined);
                state.username = (receivedData.username);
                state.token = (receivedData.token);
                localStorage.setItem("isLoggedIn", (receivedData !== undefined));
                localStorage.setItem("username", (receivedData.username));
                localStorage.setItem("token", (receivedData.token));
            }
        })
    }
})

export const { logout } = authSLice.actions;

export default authSLice.reducer;
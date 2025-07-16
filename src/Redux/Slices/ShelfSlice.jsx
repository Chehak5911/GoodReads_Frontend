import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "Configs/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    shelfList: []
}

export const getAllBookShelves = createAsyncThunk("course/getAllBookShelves", async () => {
    try{
        const response = axiosInstance.get("bookshelves", {headers: {
            "x-access-token" : localStorage.getItem("token")
        }});
        toast.promise(response, {
            loading: 'Loading bookshelves data',
            success: 'Successfully loaded bookshelves',
            error: 'Something went wrong'
        });
        return await response;
    }
    catch (error){
        console.log(error);
        toast.error("Can not fetch bookshelves data, something went wrong");
    }
})
export const addBookToShelf = createAsyncThunk("course/addBookToShelf", async (data) => {
    try{
        const response = axiosInstance.patch(`/bookshelves/${data.shelfName}/add/${data.bookId}`, {}, {headers: {
            "x-access-token" : localStorage.getItem("token")
        }});
        toast.promise(response, {
            loading: 'Adding book to shelf',
            success: 'Successfully added book to shelf',
            error: 'Something went wrong'
        });
        return await response;
    }
    catch (error){
        console.log(error);
        toast.error("Can not add book to shelf, something went wrong");
    }
})

const shelfSlice = createSlice({
    name: 'shelf',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllBookShelves.fulfilled, (state, action)=>{
            if(action?.payload?.data?.data){
                state.shelfList = action?.payload?.data?.data;
            }
        })
    }
})


export default shelfSlice.reducer;
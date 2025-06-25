import { createSlice } from "@reduxjs/toolkit"

interface AuthState{
    adminInfo: {
        username:string,
        email:string,
        role:string
        _id:string
    } | null
}

const initialState:AuthState={
    adminInfo:localStorage.getItem('adminInfo')? JSON.parse(localStorage.getItem('adminInfo')as string):null
}

export const authSlite = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setAdminInfo:(state,action)=>{
            state.adminInfo=action.payload
            localStorage.setItem('adminInfo',JSON.stringify(action.payload))
        },
        clearAdminInfo:(state)=>{
            state.adminInfo=null
            localStorage.removeItem('adminInfo')
        }
    }
})

export const {clearAdminInfo,setAdminInfo}=authSlite.actions
export default authSlite.reducer

import { api } from "../api";

interface LoginInput {
    email:string,
    password:string
}
interface UpdateInput {
    username?:string 
    email?:string,
    password?:string
}
interface updateAdminInput extends UpdateInput{
    _id:string
}

interface Registerstaff extends LoginInput{
    username:string
}

interface ITable {
table_No: number
  capacity:number,
  is_reserved: boolean,
  status: string,
}
interface IDelete {
    _id:string
}
interface IAdDelete{
     _id:string
}
interface Iupdate extends IDelete {
    table_No: number
    capacity:number,
}

export const AdminApiSlice = api.injectEndpoints({
    endpoints:(build)=>({
        Login:build.mutation({
            query:(data:LoginInput)=>({
                url:"login",
                method:'post',
                body:data,
                credentials:'include'
            })
        }),
        Logout:build.mutation({
            query:()=>({
                url:'logout',
                method:'post',
                credentials:"include"
            })
        }),
        UpdateSchema:build.mutation({
            query:(data:UpdateInput)=>({
                url: "profile",
                method:'put',
                body:data,
                credentials:'include'
            })
        }),
        AdminProfile:build.mutation({
            query:()=>({
                url:'profile',
                method:'get',
                credentials:"include"
            })
        }),
        RegisterStaff:build.mutation({
            query:(data:Registerstaff)=>({
                url:'staff',
                method:'post',
                body:data,
                credentials:'include'
            })
        }),
        CreteateTable:build.mutation({
            query:(data:ITable)=>({
                url:'add_table',
                method:'post',
                body:data,
                credentials:'include'

            })
        }),
        GetAllTable:build.mutation({
            query:()=>({
                url:'add_table',
                method:'get',
            })
        }),
        DeleteTable:build.mutation({
            query:(data:IDelete)=>({
                url:'add_table',
                method:"delete",
                body:data
            })
        }),
        UpdateTabel:build.mutation({
            query:(data:Iupdate)=>({
                url:'add_table',
                method:'put',
                body:data
            })
        }),
         GetAllAdmin:build.mutation({
            query:()=>({
                url:'Admin_table',
                method:'get',
            })
        }),
        DeleteAdmin:build.mutation({
            query:(data:IAdDelete)=>({
                url:'Admin_table',
                method:"delete",
                body:data
            })
        }),
        UpdateAdmin:build.mutation({
            query:(data:updateAdminInput)=>({
                url:'Admin_table',
                method:"put",
                body:data
            })
        }),
        createMenu:build.mutation({
            query:(data)=>({
                url:'menu-create',
                method:'post',
                body:data
            })
        })
    }),
    
})
export const{useCreateMenuMutation ,useUpdateAdminMutation,useGetAllAdminMutation,useDeleteAdminMutation, useLoginMutation,useLogoutMutation,useUpdateSchemaMutation,useGetAllTableMutation,useAdminProfileMutation,useRegisterStaffMutation,useCreteateTableMutation,useDeleteTableMutation ,useUpdateTabelMutation}=AdminApiSlice

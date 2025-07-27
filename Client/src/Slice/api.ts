import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const api = createApi({
    reducerPath:'api',
    baseQuery: fetchBaseQuery({baseUrl:'http://localhost:3000/api'}),
    endpoints: (builder) => ({
        getDetailData: builder.query({
            query: (id) => ({
                url: `/reservation/detail/${id}`,
                method: "get",
            })
        })
    }),
})

export const { useGetDetailDataQuery } = api;
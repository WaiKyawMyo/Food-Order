import { configureStore } from '@reduxjs/toolkit'
import  authSlite  from './Slice/auth'
import { api } from './Slice/api'



export const store = configureStore({
  reducer: {
    auth:authSlite,
    [api.reducerPath]:api.reducer
  },
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat(api.middleware),
  devTools:true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
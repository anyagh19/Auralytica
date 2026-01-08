import {configureStore} from '@reduxjs/toolkit'
import  totalSalesReducer  from './slices/totalSalesSlice'

export const store = configureStore({
    reducer: {
        sales: totalSalesReducer
    }
})
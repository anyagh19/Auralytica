import { createSlice } from "@reduxjs/toolkit";

export const totalSalesSlice = createSlice({
    name: 'sales',
    initialState: {
        item: []
    },
    reducers : {
        setSales: (state, action) => {
            state.item = action.payload
        },
        addItem: (state, action) => {
            state.item.unshift(action.payload)
        },
        deleteItem: (state , action) => {
            state.item = state.item.filter(item => item.id !== action.payload)
        }
    }
})

export const {setSales , addItem , deleteItem} = totalSalesSlice.actions

export default totalSalesSlice.reducer
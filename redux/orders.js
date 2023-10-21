import { createSlice } from '@reduxjs/toolkit'
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { database } from '../firebase/config';

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:[],
  },
  reducers: {
    load: (state, action) => {
        state.orders = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { load } = ordersSlice.actions

export default ordersSlice.reducer
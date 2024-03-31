import { createSlice } from '@reduxjs/toolkit'
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { database } from '../firebase/config';
import dayjs from 'dayjs';
import { callordersDB } from 'components/helpers/getOrders';

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:[],
    date: dayjs().startOf('day').toISOString() ?? "2023-12-28T00:04:20.135+00:00",
  },
  reducers: {
    load: (state, action) => {
        state.orders = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
      callordersDB(state.date);
    }
  },
})

// Action creators are generated for each case reducer function
export const { load, setDate } = ordersSlice.actions

export default ordersSlice.reducer
import { createSlice } from '@reduxjs/toolkit'
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { database } from '../firebase/config';

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    vegetables: false,
    fruits: false,
    beverages: false,
  },
  reducers: {
    load: (state, action) => {
      if(action.payload){
        state[action.payload.type] = [...action.payload.arr];
        console.log("done")
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { load } = inventorySlice.actions

export default inventorySlice.reducer
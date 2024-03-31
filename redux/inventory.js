import { createSlice } from '@reduxjs/toolkit'
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { database } from '../firebase/config';

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: {},
  },
  reducers: {
    load: (state, action) => {
      if(action.payload){
        state.items = {...action.payload};
        console.log("inventory updated")
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { load } = inventorySlice.actions

export default inventorySlice.reducer
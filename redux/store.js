import { configureStore } from '@reduxjs/toolkit'
import inventoryReducer from './inventory';
import ordersReducer from './orders';

export default configureStore({
  reducer: {
    inventory: inventoryReducer,
    orders: ordersReducer,
  },
})
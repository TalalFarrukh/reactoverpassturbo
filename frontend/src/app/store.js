import { configureStore } from '@reduxjs/toolkit'
import lineReducer from '../features/lineSlice'
import shapeReducer from '../features/shapeSlice'


export const store = configureStore({
  reducer: {
    line: lineReducer,
    shape: shapeReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
})
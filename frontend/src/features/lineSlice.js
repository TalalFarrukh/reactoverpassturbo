import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  lineData: [],
}

export const lineSlice = createSlice({
  name: 'LineLayer',
  initialState: initialState,
  reducers: {
    addLayer: (state, action) => {
      state.lineData = [...state.lineData, action.payload]
    }
  },
})

// Action creators are generated for each case reducer function
export const { addLayer } = lineSlice.actions

export default lineSlice.reducer
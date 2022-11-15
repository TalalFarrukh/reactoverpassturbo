import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  shapeData: [],
}

export const shapeSlice = createSlice({
  name: 'ShapeLayer',
  initialState: initialState,
  reducers: {
    addShapeLayer: (state, action) => {
      state.shapeData = [...state.shapeData, action.payload]
    }
  },
})

// Action creators are generated for each case reducer function
export const { addShapeLayer } = shapeSlice.actions

export default shapeSlice.reducer
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  amount: 0,
  totalAmount: 0,
  totalPrice: 0,
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const cart = action.payload;
      state.amount = cart.cartItems.length;
      state.totalAmount = cart.totalAmount;
      state.totalPrice = cart.totalPrice;
    },
  },
});
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;

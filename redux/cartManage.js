import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "cartManage",
  initialState: {
    cart: {
      quantity: 0,
      foods: [],
    },
  },
  reducers: {
    increaseQuantity: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.cart.quantity += 1;
    },
    decreaseQuantity: (state) => {
      state.cart.quantity -= 1;
    },
    increaseQuantityByAmount: (state, action) => {
      state.cart.quantity += action.payload;
    },

    decreaseQuantityByAmount: (state, action) => {
      state.cart.quantity -= action.payload;
    },

    updateFoods: (state, action) => {
      const id = action.payload.id;
      const index = state.cart.foods.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.cart.foods[index] = action.payload;
      } else {
        state.cart.foods.push(action.payload);
      }
    },

    updateCart: (state, action) => {
      state.cart = action.payload;
    },

    removeFood: (state, action) => {
      const id = action.payload.id;
      const newFoods = state.cart.foods.filter((item) => item.id !== id);
      state.cart.foods = newFoods;
    },

    removeSelectedFoods: (state, action) => {
      const newFoods = state.cart.foods.filter((item) => item.choose === false);
      state.cart.foods = newFoods;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  increaseQuantity,
  decreaseQuantity,
  increaseQuantityByAmount,
  updateFoods,
  updateCart,
  removeFood,
  decreaseQuantityByAmount,
  removeSelectedFoods,
} = counterSlice.actions;

export default counterSlice.reducer;

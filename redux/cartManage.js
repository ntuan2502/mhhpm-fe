import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";
export const counterSlice = createSlice({
  name: "cartManage",
  initialState: {
    cart: {
      id: v4(),
      quantity: 0,
      foods: [],
      table: null,
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

    addFoodsToCart: (state, action) => {
      const id = action.payload.id;
      const index = state.cart.foods.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.cart.foods[index].quantity += action.payload.quantity;
        state.cart.foods[index].user_description =
          action.payload.user_description;
        state.cart.foods[index].totalPrice += action.payload.totalPrice;
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

    updateTable: (state, action) => {
      state.cart.table = action.payload;
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
  addFoodsToCart,
  updateTable,
} = counterSlice.actions;

export default counterSlice.reducer;

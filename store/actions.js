import { SET_CART_QUANTITY, SET_CART_FOODS, SET_CART } from "./constants";

export const setCartQuantity = (payload) => ({
  type: SET_CART_QUANTITY,
  payload,
});

export const setCartFoods = (payload) => ({
  type: SET_CART_FOODS,
  payload,
});

export const setCart = (payload) => ({
  type: SET_CART,
  payload,
});

import { SET_CART_QUANTITY, SET_CART_FOODS, SET_CART } from "./constants";

const initState = {
  cart: {
    quantity: 0,
    foods: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case SET_CART_QUANTITY:
      return {
        ...state,
        cart: { ...state.cart, quantity: action.payload },
      };
    case SET_CART_FOODS:
      return {
        ...state,
        cart: { ...state.cart, foods: action.payload },
      };

    case SET_CART:
      return {
        ...state,
        cart: action.payload,
      };
    default:
      throw new Error("Invalid action");
  }
}

export { initState };
export default reducer;

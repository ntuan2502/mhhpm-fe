import Context from "./Context";
import { useReducer, useEffect } from "react";
import reducer, { initState } from "./reducer";
import { setCart } from "./actions";
export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    const sessionCart = window.sessionStorage.getItem("cart");
    if (sessionCart) {
      dispatch(setCart(JSON.parse(sessionCart)));
    } else {
      window.sessionStorage.setItem("cart", JSON.stringify(initState));
    }
  }, []);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
}

import Context from "./Context";
import { useReducer, useEffect } from "react";
import reducer, { initState } from "./reducer";
import { setCart } from "./actions";
import { getSession } from "next-auth/react";
import axios from "axios";

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(async () => {
    const session = await getSession();
    if (session) {
      const res = await axios.get("http://localhost:8000/cart");
      window.sessionStorage.removeItem("cart");
      dispatch(setCart(res.data[0]));
    } else {
      const sessionCart = window.sessionStorage.getItem("cart");
      if (sessionCart) {
        dispatch(setCart(JSON.parse(sessionCart)));
      } else {
        window.sessionStorage.setItem("cart", JSON.stringify(initState));
      }
    }
  }, []);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
}

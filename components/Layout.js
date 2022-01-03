import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useDispatch } from "react-redux";
import { getSession } from "next-auth/react";
import axios from "axios";
import { updateCart } from "../redux/cartManage";
export default function Layout({ children }) {
  const dispatch = useDispatch();
  useEffect(async () => {
    const session = await getSession();
    if (session) {
      const res = await axios.get("http://localhost:8000/cart");
      const data = await res.data[0];
      dispatch(updateCart(data));
    }
  }, []);

  return (
    <>
      <Header></Header>
      {children}
      <Footer></Footer>
    </>
  );
}

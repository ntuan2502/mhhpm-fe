import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";
export default function Layout({ children }) {
  return (
    <>
      <Header></Header>
      {children}
      <Footer></Footer>
    </>
  );
}

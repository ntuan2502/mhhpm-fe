import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BillItem from "../../components/Bill/BillItem";
import { css } from "@emotion/react";
import { BeatLoader, FadeLoader } from "react-spinners";
import { currencyFormat } from "../../lib/format";

export default function index() {
  const { cart } = useSelector((state) => state.cartManage);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState({});
  const [payStatus, setPayStatus] = useState("null");

  useEffect(async () => {
    console.log(cart);
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bills?session=${cart.id}`
    );
    const data = await res.data;
    if (data[0]) {
      setBill(data[0]);

      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bill-details?bill.id=${data[0].id}`
      );

      const data2 = await res2.data;
      setItems(data2);
    }
    setLoading(false);
  }, []);

  const fetchAgain = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bills?session=${cart.id}`
    );
    const data = await res.data;
    if (data[0]) {
      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bill-details?bill.id=${data[0].id}`
      );
      const data2 = await res2.data;
      setItems(data2);
    }
  };

  useEffect(() => {
    if (items.length !== 0) {
      let handle;
      if (hasPending()) {
        console.log("fetching...");
        handle = setTimeout(async () => {
          await fetchAgain();
        }, 5000);
      } else {
        console.log("Check rejeced");
        if (isAllReject()) {
          setPayStatus("reject");
        } else {
          setPayStatus("done");
        }
      }
    }

    return () => {
      clearTimeout(handle);
    };
  }, [items]);

  const hasPending = () => {
    for (let i = 0; i < items.length; ++i) {
      if (items[i].status === "pending") {
        return true;
      }
    }
    return false;
  };

  const isAllReject = () => {
    for (let i = 0; i < items.length; ++i) {
      console.log(items[i].status);
      if (items[i].status !== "reject") {
        return false;
      }
    }
    return true;
  };
  return (
    <>
      {loading && (
        <div className="flex justify-center my-8">
          <FadeLoader loading={loading} color={"#000"} />
        </div>
      )}

      {items.length !== 0 && (
        <div className="container py-24 mx-auto font-Roboto_Normal mb-6">
          <h1 className="text-5xl font-bold mb-8">BILL</h1>

          <table className="w-full text-3xl font-bold">
            <thead className=" after:content-[''] after:block after:leading-5 after:text-transparent after:h-5 bg-cart-background-color after:bg-white">
              <tr>
                <th className="text-left pl-10">
                  All ({items.length} products)
                </th>
                <th>Unit price</th>
                <th>Quantity</th>
                <th>Into money</th>
                <th>Status</th>
              </tr>
            </thead>

            {/* List item */}
            <tbody className="text-center bg-cart-background-color">
              {items.map((item) => (
                <BillItem item={item} key={item.id}></BillItem>
              ))}
            </tbody>
          </table>

          <div className="flex my-8  text-3xl justify-end ">
            <div className="ml-10 py-5 bg-cart-background-color px-6 w-[500px]">
              <div className="flex justify-between">
                <p className="font-bold">Total</p>
                <p>{currencyFormat(bill.total_prices)}</p>
              </div>
            </div>
          </div>

          {/* If bill has been accepted */}
          {payStatus === "done" && (
            <button className="payment-btn text-5xl bold bg-active-button-color text-white float-right px-32 py-3 rounded-sm font-bold mt-6">
              Pay
            </button>
          )}

          {/* If bill is still pending */}
          {payStatus === "null" && (
            <button
              disabled
              className="payment-btn--disabled text-3xl bold bg-active-button-color text-white float-right px-6 py-3 rounded-sm font-bold mt-6"
            >
              Waiting for confirm <BeatLoader loading={true} color={"#fff"} />
            </button>
          )}

          {payStatus === "reject" && (
            <div className="text-center text-4xl">
              <h1>Your order has been rejected all</h1>
              <h1>Please choose other foods</h1>
            </div>
          )}
        </div>
      )}

      {items.length === 0 && !loading && (
        <h1 className="text-center text-4xl font-bold my-8">
          You have not ordered yet!!!
        </h1>
      )}
    </>
  );
}

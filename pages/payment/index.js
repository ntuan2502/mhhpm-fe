import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BillItem from "../../components/Bill/BillItem";
import { css } from "@emotion/react";
import { BeatLoader, FadeLoader } from "react-spinners";
import { currencyFormat } from "../../lib/format";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { v4 } from "uuid";
import { SquareLoader } from "react-spinners";
import { updateCart } from "../../redux/cartManage";
import { useRouter } from "next/router";
export default function index() {
  const { cart } = useSelector((state) => state.cartManage);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState({});
  const [payStatus, setPayStatus] = useState("null");
  const [billStatus, setBillStatus] = useState("null");
  const [paying, setPaying] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [payProcess, setPayProcess] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const calTotalPrice = () => {
    const itemsArr = items.filter((item) => item.status === "accept");
    let sum = 0;
    itemsArr.forEach((item) => (sum += item.prices));
    setTotalPrice(sum);
  };
  useEffect(async () => {
    console.log(cart);
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bills?session=${cart.id}`
    );
    const data = await res.data;
    if (data[0]) {
      setBill(data[0]);
      setBillStatus(data[0].status);
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
    let handle;
    if (items.length !== 0) {
      calTotalPrice();
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

  const payingNow = () => {
    setPaying(true);
  };

  const cancelPaying = () => {
    setPaying(false);
  };

  const deleteAllRejectedBillDetails = async () => {
    // Delete all
    const itemsArr = items.filter((item) => item.status === "reject");
    for (let index = 0; index < itemsArr.length; ++index) {
      console.log(itemsArr[index]);
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/deleteRejectedBillDetail`,
        { data: itemsArr[index] },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  };

  const payByCash = async () => {
    setPayProcess(true);
    await deleteAllRejectedBillDetails();

    const newBill = {
      id: bill.id,
      status: "pending",
      total_prices: totalPrice,
    };
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/updateBill`,
      newBill,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setBillStatus("pending");
    setPayProcess(false);
  };

  const payByOthers = async () => {
    setPayProcess(true);

    await deleteAllRejectedBillDetails();
    const newBill = {
      id: bill.id,
      status: "done",
      total_prices: totalPrice,
    };

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/updateBill`,
      newBill,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setBillStatus("done");
    setPayProcess(false);
  };

  useEffect(async () => {
    let handle;
    if (billStatus !== "null") {
      if (billStatus === "pending") {
        handle = setTimeout(async () => {
          await fetchBillAgain();
        }, 3000);
      } else {
        setBillStatus("done");
      }
    }
    return () => {
      clearTimeout(handle);
    };
  }, [billStatus, bill]);

  const fetchBillAgain = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bills/${bill.id}`
    );
    const data = await res.data;
    console.log(data.status);
    setBillStatus(data.status);
    setBill(data);
  };

  const printBill = async () => {
    const newCart = {
      id: v4(),
      quantity: 0,
      foods: [],
    };
    dispatch(updateCart(newCart));
    router.push("/payment/" + bill.id);
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
                <th>Staff description</th>
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

          <div className="flex my-8  text-3xl justify-between">
            <div></div>

            <div className="ml-10 py-5 bg-cart-background-color px-6 w-[500px] self-end">
              <div className="flex justify-between">
                <p className="font-bold">Total</p>
                <p>{currencyFormat(totalPrice)}</p>
              </div>
            </div>
          </div>

          {/* If billDetails has been accepted */}
          {payStatus === "done" && (
            <button
              onClick={() => payingNow()}
              className="payment-btn text-5xl bold bg-active-button-color text-white float-right px-32 py-3 rounded-sm font-bold mt-6"
            >
              Pay
            </button>
          )}

          {/* If billDetails is still pending */}
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

      {paying && (
        <>
          <div className="modal-layout fixed top-0 bottom-0 left-0 right-0 bg-layout-color"></div>
          <div className="modal-body bg-white fixed flex flex-col rounded-lg   px-6 py-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] ">
            <FontAwesomeIcon
              icon={faTimes}
              className="self-end mb-2 text-3xl cursor-pointer"
              onClick={() => cancelPaying()}
            ></FontAwesomeIcon>
            <h1 className="text-center font-bold text-3xl">
              CHOOSE A PAYMENT METHOD
            </h1>
            {/* Pay by cash */}
            <div
              className="flex mt-6 border border-border-color items-center justify-center p-4 select-none cursor-pointer"
              onClick={() => payByCash()}
            >
              <div className="w-[50px] h-[50px] relative">
                <Image
                  src="/assets/img/cash.png"
                  layout="fill"
                  objectFit="cover"
                ></Image>
              </div>
              <p className="text-3xl ml-6">By cash</p>
            </div>

            {/* Pay by momo */}
            <div
              onClick={() => payByOthers()}
              className="flex mt-6 border border-border-color items-center justify-center p-4 select-none cursor-pointer"
            >
              <div className="w-[50px] h-[50px] relative">
                <Image
                  src="/assets/img/momo.png"
                  layout="fill"
                  objectFit="cover"
                ></Image>
              </div>
              <p className="text-3xl ml-6">Momo</p>
            </div>

            {/* Pay by credit card */}
            <div
              onClick={() => payByOthers()}
              className="flex mt-6 mb-6 border border-border-color items-center justify-center p-4 select-none cursor-pointer"
            >
              <div className="w-[50px] h-[50px] relative">
                <Image
                  src="/assets/img/card.png"
                  layout="fill"
                  objectFit="cover"
                ></Image>
              </div>
              <p className="text-3xl ml-6">By credit card</p>
            </div>
          </div>
        </>
      )}

      {billStatus === "pending" && (
        <>
          <div className="modal-layout fixed top-0 bottom-0 left-0 right-0 bg-layout-color"></div>
          <div className="modal-body bg-white fixed  flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[50%]">
            <SquareLoader
              loading={true}
              color="#FF8787"
              size={90}
            ></SquareLoader>
            <h1 className="text-2xl mt-6">Wating for confirm payment</h1>
          </div>
        </>
      )}

      {billStatus === "done" && (
        <>
          <div className="modal-layout fixed top-0 bottom-0 left-0 right-0 bg-layout-color"></div>
          <div className="modal-body ordered--success bg-white fixed  flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[50%]">
            <h1 className="text-2xl -mt-8">You have paid successfully</h1>
            <button
              className="mt-10 px-6 py-2 bg-normal-button-color text-white text-2xl"
              onClick={() => printBill()}
            >
              Okay
            </button>
          </div>
        </>
      )}

      {payProcess && (
        <>
          <div className="modal-layout fixed top-0 bottom-0 left-0 right-0 bg-layout-color"></div>
          <div className="modal-body bg-white fixed  flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[50%]">
            <SquareLoader
              loading={true}
              color="#FF8787"
              size={90}
            ></SquareLoader>
            <h1 className="text-2xl mt-6">Processing your payment...</h1>
          </div>
        </>
      )}
    </>
  );
}

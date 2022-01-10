import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import CartItem from "./../../components/Cart/CartItem";
import { currencyFormat } from "../../lib/format";
import { useSelector, useDispatch } from "react-redux";
import { v4 } from "uuid";
import axios from "axios";
import { SquareLoader } from "react-spinners";
import { getSession } from "next-auth/react";
import {
  decreaseQuantity,
  decreaseQuantityByAmount,
  increaseQuantity,
  removeFood,
  removeSelectedFoods,
  updateFoods,
} from "../../redux/cartManage";
import { useRouter } from "next/router";

export default function Cart() {
  const router = useRouter();
  const { cart } = useSelector((state) => state.cartManage);
  const { table } = useSelector((state) => state.cartManage);
  const items = cart.foods;

  const [totalPriceNoDiscount, setTotalPriceNoDiscount] = useState();
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState();
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(false);
  const dispatch = useDispatch();

  const onChangeNote = (index, text) => {
    const itemsArr = [...items];
    const food = { ...itemsArr[index] };
    food.user_description = text;
    dispatch(updateFoods(food));
  };

  const IncreaseQuantity = (index) => {
    // if (quantity === food.stock) return;

    const itemsArr = [...items];
    const food = { ...itemsArr[index] };
    food.quantity++;
    food.totalPrice = food.quantity * food.prices;
    dispatch(increaseQuantity());
    dispatch(updateFoods(food));
  };

  const DecreaseQuantity = (index) => {
    const itemsArr = [...items];

    if (itemsArr[index].quantity === 1) return;

    const food = { ...itemsArr[index] };
    food.quantity--;
    food.totalPrice = food.quantity * food.prices;
    dispatch(decreaseQuantity());
    dispatch(updateFoods(food));
  };

  const ToggleChoice = (event, index) => {
    const itemsArr = [...items];
    const food = { ...itemsArr[index] };
    if (event.target.checked) {
      food.choose = true;
    } else {
      food.choose = false;
    }
    dispatch(updateFoods(food));
  };

  const ToggleChoiceAll = (event) => {
    const itemsArr = [...items];
    if (event.target.checked) {
      itemsArr.map((item) => {
        const food = { ...item };
        food.choose = true;
        dispatch(updateFoods(food));
      });
    } else {
      itemsArr.map((item) => {
        const food = { ...item };
        food.choose = false;
        dispatch(updateFoods(food));
      });
    }
  };

  const allChecked = () => {
    const itemsArr = [...items];

    for (let i = 0; i < itemsArr.length; i++) {
      if (itemsArr[i].choose === false) return false;
    }
    return true;
  };

  const Remove = (index) => {
    const itemsArr = [...items];
    const food = { ...itemsArr[index] };
    dispatch(decreaseQuantityByAmount(food.quantity));
    dispatch(removeFood(food));
  };

  const RemoveSelected = () => {
    const itemsArr = items.filter((item) => item.choose === true);
    itemsArr.map((item) => dispatch(decreaseQuantityByAmount(item.quantity)));
    dispatch(removeSelectedFoods());
  };

  const CalcTotalPrice = () => {
    let sum = 0;
    items.forEach((item) => {
      if (item.choose) sum += item.totalPrice;
    });
    return sum;
  };

  const CalcQuantity = () => {
    let sum = 0;
    items.forEach((item) => {
      if (item.choose) sum += item.quantity;
    });
    return sum;
  };

  useEffect(() => {
    const sum = CalcTotalPrice();
    setTotalPriceNoDiscount(sum);
    const totalPricesWithDiscount = sum - discount < 0 ? 0 : sum - discount;

    setTotalPrice(totalPricesWithDiscount);
  }, [items]);

  const createOrder = async () => {
    const itemsArr = items.filter((item) => item.choose === true);
    if (itemsArr.length === 0) return;

    setLoading(true);
    const billRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/bills?session=${cart.id}`
    );
    let billData = await billRes.data[0];
    if (!billData) {
      const session = await getSession();
      const bill = session
        ? {
            name: session.user.name,
            user: session._user._id,
          }
        : {
            name: "Normal User",
            user: null,
          };
      bill.total_prices = totalPrice;
      bill.table = table;
      bill.session = cart.id;
      bill.bill_details = [];
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/createBill`,
        bill,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      billData = await res.data.bill;
    }
    // If bill existed. Updated bill
    else {
      const bill = {
        total_prices: billData.total_prices + totalPrice,
        id: billData.id,
      };
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/updateBill`,
        bill
      );
      billData = await res.data;
    }
    // Create bill detail records

    for (let index = 0; index < itemsArr.length; ++index) {
      const quantity = itemsArr[index].quantity;

      const newSold = itemsArr[index].sold + quantity;
      // window.location = `${process.env.NEXT_PUBLIC_BACKEND_URL}/foods/${itemsArr[index].id}`;
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/updateSold?id=${itemsArr[index].id}&sold=${newSold}`
      );
      const billDetailItem = {
        food: itemsArr[index].id,
        quantity: quantity,
        prices: itemsArr[index].totalPrice,
        bill: billData.id,
        status: "pending",
        description: "",
        user_description: itemsArr[index].user_description,
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/createBillDetail`,
        billDetailItem,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    RemoveSelected();
    setLoading(false);
    setOrderStatus(true);
    // router.push("/payment");
  };

  return (
    <>
      {" "}
      <div className="container py-24 mx-auto font-Roboto_Normal">
        <h1 className="text-5xl font-bold mb-8">CART</h1>

        <table className="w-full text-3xl font-bold">
          <thead className=" after:content-[''] after:block after:leading-5 after:text-transparent after:h-5 bg-cart-background-color after:bg-white">
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="w-8 h-8 align-middle -mt-2 "
                  onChange={(e) => ToggleChoiceAll(e)}
                  checked={allChecked()}
                />
              </th>
              <th className="text-left">All ({items.length} products)</th>
              <th>Unit price</th>
              <th>Quantity</th>
              <th>Into money</th>
              <th>User description</th>
              <th className="pr-3">
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  onClick={() => RemoveSelected()}
                  className="cursor-pointer"
                ></FontAwesomeIcon>
              </th>
            </tr>
          </thead>

          <tbody className="text-center bg-cart-background-color font-medium">
            {items.map((item, index) => (
              <CartItem
                item={item}
                index={index}
                ToggleChoice={ToggleChoice}
                key={item.id}
                IncreaseQuantity={IncreaseQuantity}
                DecreaseQuantity={DecreaseQuantity}
                Remove={Remove}
                onChangeNote={onChangeNote}
              ></CartItem>
            ))}
          </tbody>
        </table>

        <div className="flex my-8  text-3xl justify-end ">
          <div className=" py-5 bg-cart-background-color px-6 w-[500px]">
            <div className="flex justify-between">
              <p className="font-bold">Voucher</p>
              <p>2 available</p>
            </div>

            <div className="flex justify-between items-center mt-8">
              <Image
                src="/assets/img/voucher.png"
                width={110}
                height={110}
              ></Image>
              <p className="mt-6 text-blue-600">Select a voucher</p>
            </div>
          </div>
          <div className="ml-10 py-5 bg-cart-background-color px-6 w-[500px]">
            <div className="flex justify-between">
              <p className="font-bold">Total</p>
              <p>{currencyFormat(totalPriceNoDiscount)}</p>
            </div>

            <div className="flex justify-between items-center mt-8">
              <p className="font-bold">Discount</p>
              <p>{currencyFormat(discount)}</p>
            </div>
            <p className="text-right py-2 border-t-2 border-border-color mt-6">
              {currencyFormat(totalPrice)}
            </p>
          </div>
        </div>

        <button
          className="text-3xl bold bg-active-button-color text-white float-right px-32 py-3 rounded-sm font-bold"
          onClick={() => createOrder()}
        >
          Order
        </button>
      </div>
      {loading && (
        <>
          {" "}
          <div className="modal-layout fixed top-0 bottom-0 left-0 right-0 bg-layout-color"></div>
          <div className="modal-body bg-white fixed  flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[50%]">
            <SquareLoader
              loading={true}
              color="#FF8787"
              size={90}
            ></SquareLoader>
            <h1 className="text-2xl mt-6">Loading...</h1>
          </div>
        </>
      )}
      {orderStatus && (
        <>
          <div className="modal-layout fixed top-0 bottom-0 left-0 right-0 bg-layout-color"></div>
          <div className="modal-body ordered--success bg-white fixed  flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[50%]">
            <h1 className="text-2xl -mt-8">You have ordered successfully</h1>
            <button
              className="mt-10 px-6 py-2 bg-normal-button-color text-white text-2xl"
              onClick={() => router.push("/payment")}
            >
              Okay
            </button>
          </div>
        </>
      )}
    </>
  );
}

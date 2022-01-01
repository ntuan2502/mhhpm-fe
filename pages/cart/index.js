import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import CartItem from "./../../components/Cart/CartItem";
import { useStore, actions } from "../../store";
import { storeToSession } from "../../lib/SessionStore";
export default function Cart() {
  const [state, dispatch] = useStore();
  const cart = state.cart;
  const items = state.cart.foods;

  const [totalPriceNoDiscount, setTotalPriceNoDiscount] = useState();
  const [discount, setDiscount] = useState(10);
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    storeToSession("cart", cart);
  }, [state]);

  const IncreaseQuantity = (index) => {
    // if (quantity === food.stock)
    //   return;

    const itemsArr = [...items];

    itemsArr[index].quantity++;
    itemsArr[index].totalPrice =
      itemsArr[index].quantity * itemsArr[index].prices;

    const newCartQuantity = cart.quantity + 1;
    dispatch(actions.setCartQuantity(newCartQuantity));
    dispatch(actions.setCartFoods(itemsArr));
  };

  const DecreaseQuantity = (index) => {
    const itemsArr = [...items];

    if (itemsArr[index].quantity === 1) return;

    itemsArr[index].quantity--;
    itemsArr[index].totalPrice =
      itemsArr[index].quantity * itemsArr[index].prices;
    const newCartQuantity = cart.quantity - 1;

    dispatch(actions.setCartQuantity(newCartQuantity));
    dispatch(actions.setCartFoods(itemsArr));
  };

  const ToggleChoice = (event, index) => {
    const itemsArr = [...items];
    if (event.target.checked) {
      itemsArr[index].choose = true;
    } else {
      itemsArr[index].choose = false;
    }
    dispatch(actions.setCartFoods(itemsArr));
  };

  const ToggleChoiceAll = (event) => {
    const itemsArr = [...items];
    if (event.target.checked) {
      itemsArr.map((item) => (item.choose = true));
    } else {
      itemsArr.map((item) => (item.choose = false));
    }

    dispatch(actions.setCartFoods(itemsArr));
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
    const newCartQuantity = cart.quantity - itemsArr[index].quantity;
    itemsArr.splice(index, 1);
    dispatch(actions.setCartFoods(itemsArr));
    dispatch(actions.setCartQuantity(newCartQuantity));
  };

  const RemoveSelected = () => {
    const itemsArr = items.filter((item) => item.choose !== true);
    let newCartQuantity = 0;

    itemsArr.forEach((item) => {
      newCartQuantity += item.quantity;
    });
    dispatch(actions.setCartQuantity(newCartQuantity));
    dispatch(actions.setCartFoods(itemsArr));
  };

  const CalcTotalPrice = () => {
    let sum = 0;
    items.forEach((item) => {
      if (item.choose) sum += item.totalPrice;
    });
    return sum;
  };

  useEffect(() => {
    const sum = CalcTotalPrice();
    setTotalPriceNoDiscount(sum);
    setTotalPrice((sum -= discount));
  }, [items]);
  // console.log(items);
  return (
    <div className="container py-24 mx-auto font-Kulim_Park_Normal">
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
            <th className="p-3">
              <FontAwesomeIcon
                icon={faTrashAlt}
                onClick={() => RemoveSelected()}
                className="cursor-pointer"
              ></FontAwesomeIcon>
            </th>
          </tr>
        </thead>

        <tbody className="text-center bg-cart-background-color">
          {items.map((item, index) => (
            <CartItem
              item={item}
              index={index}
              ToggleChoice={ToggleChoice}
              key={item.id}
              IncreaseQuantity={IncreaseQuantity}
              DecreaseQuantity={DecreaseQuantity}
              Remove={Remove}
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
            <p>{totalPriceNoDiscount}</p>
          </div>

          <div className="flex justify-between items-center mt-8">
            <p className="font-bold">Discount</p>
            <p>{discount}</p>
          </div>
          <p className="text-right py-2 border-t-2 border-border-color mt-6">
            {totalPrice}$
          </p>
        </div>
      </div>

      <button className="text-5xl bold bg-active-button-color text-white float-right px-32 py-3 rounded-sm font-bold">
        Order
      </button>
    </div>
  );
}

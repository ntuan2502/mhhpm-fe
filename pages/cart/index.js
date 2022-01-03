import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import CartItem from "./../../components/Cart/CartItem";
import { currencyFormat } from "../../lib/format";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseQuantity,
  decreaseQuantityByAmount,
  increaseQuantity,
  removeFood,
  removeSelectedFoods,
  updateFoods,
} from "../../redux/cartManage";

export default function Cart() {
  const { cart } = useSelector((state) => state.cartManage);
  const items = cart.foods;

  const [totalPriceNoDiscount, setTotalPriceNoDiscount] = useState();
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState();
  const dispatch = useDispatch();
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

  useEffect(() => {
    const sum = CalcTotalPrice();
    setTotalPriceNoDiscount(sum);
    const totalPricesWithDiscount = sum - discount < 0 ? 0 : sum - discount;

    setTotalPrice(totalPricesWithDiscount);
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

      <button className="text-5xl bold bg-active-button-color text-white float-right px-32 py-3 rounded-sm font-bold">
        Order
      </button>
    </div>
  );
}

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import { currencyFormat } from "../../lib/format";
import Link from "next/link";
export default function CartItem({
  item,
  ToggleChoice,
  index,
  IncreaseQuantity,
  DecreaseQuantity,
  Remove,
}) {
  return (
    <tr>
      <td className="">
        <input
          checked={item.choose}
          type="checkbox"
          className="w-8 h-8 align-middle -mt-2 "
          onChange={(e) => ToggleChoice(e, index)}
        />
      </td>

      <td>
        <Link href={"/menu/" + item.slug}>
          <a className="flex justify-left items-center">
            <Image src={item.images[0].url} width={143} height={90}></Image>
            <span className="w-80 text-3xl font-bold line-clamp-3 ml-8">
              {item.name}
            </span>
          </a>
        </Link>
      </td>

      <td>{currencyFormat(item.prices)}</td>
      <td>
        {" "}
        <span
          className={
            item.quantity === 1
              ? " inline-block w-10 h-10 border-black border-2 rounded-full text-center select-none box-border"
              : " inline-block w-10 h-10 border-black border-2 rounded-full  text-center select-none cursor-pointer  "
          }
          onClick={() => DecreaseQuantity(index)}
        >
          -
        </span>
        <input
          type="text"
          className="w-20 text-center mx-2 "
          disabled
          value={item.quantity}
        />
        <span
          className={
            item.quantity === 14
              ? " inline-block w-10 h-10 bg-active-button-color text-white rounded-full select-none px-3 "
              : " inline-block w-10 h-10 bg-active-button-color text-white rounded-full select-none px-3 cursor-pointer  "
          }
          onClick={() => IncreaseQuantity(index)}
        >
          +
        </span>
      </td>
      <td>{currencyFormat(item.totalPrice)}</td>
      <td className="p-3">
        <FontAwesomeIcon
          icon={faTrashAlt}
          onClick={() => Remove(index)}
          className="cursor-pointer"
        ></FontAwesomeIcon>
      </td>
    </tr>
  );
}

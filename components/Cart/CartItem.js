import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import { currencyFormat } from "../../lib/format";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
export default function CartItem({
  item,
  ToggleChoice,
  index,
  IncreaseQuantity,
  DecreaseQuantity,
  Remove,
  onChangeNote,
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
            <div className="w-[100px] h-[100px] relative">
              <Image
                src={item.images[0].url}
                layout="fill"
                objectFit="cover"
              ></Image>
            </div>

            <span className="w-48 text-3xl line-clamp-3">{item.name}</span>
          </a>
        </Link>
      </td>

      <td>{currencyFormat(item.prices)}</td>
      <td>
        <div className="flex justify-center">
          <span
            className={
              item.quantity === 1
                ? " flex items-center justify-center w-10 h-10 border-black border-2 rounded-full text-center select-none box-border"
                : " flex items-center justify-center w-10 h-10 border-black border-2 rounded-full  text-center select-none cursor-pointer  "
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
                ? " flex items-center justify-center w-10 h-10 bg-active-button-color text-white rounded-full select-none px-3 "
                : " flex items-center justify-center w-10 h-10 bg-active-button-color text-white rounded-full select-none px-3 cursor-pointer  "
            }
            onClick={() => IncreaseQuantity(index)}
          >
            +
          </span>
        </div>
      </td>
      <td>{currencyFormat(item.totalPrice)}</td>
      <td>
        <TextareaAutosize
          style={{ boxSizing: "border-box" }}
          className="staff__description text-center bg-white border border-border-color w-[250px]"
          value={item.user_description}
          maxRows={3}
          onChange={(e) => {
            onChangeNote(index, e.target.value);
          }}
          placeholder="empty"
        />
      </td>
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

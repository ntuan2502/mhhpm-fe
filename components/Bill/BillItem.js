import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import { currencyFormat } from "../../lib/format";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
export default function BillItem({ item }) {
  return (
    <tr>
      <td className="text-2xl font-normal">
        <Link href={"/menu/" + item.food.slug}>
          <a className="flex justify-left items-center">
            <Image
              src={item.food.images[0].url}
              width={143}
              height={90}
            ></Image>
            <span className="w-80 line-clamp-3 ml-8">{item.food.name}</span>
          </a>
        </Link>
      </td>

      <td className="text-2xl font-normal">
        {currencyFormat(item.food.prices)}
      </td>
      <td className="text-2xl font-normal">
        <input
          type="text"
          className="w-20 text-center mx-2 "
          disabled
          value={item.quantity}
        />
      </td>
      <td className="text-2xl font-normal">{currencyFormat(item.prices)}</td>
      <td className="p-3">
        {item.status === "reject" && (
          <input
            type="checkbox"
            className="w-8 h-8 align-middle -mt-2 relative reject"
            disabled
          />
        )}

        {item.status === "accept" && (
          <input
            type="checkbox"
            className="w-8 h-8 align-middle -mt-2 relative accept"
            disabled
          />
        )}

        {item.status === "pending" && <ClipLoader loading={true}></ClipLoader>}
      </td>
    </tr>
  );
}

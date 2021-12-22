import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Food({ food }) {
  return (
    <div className="col-span-3 ">
      <div className="relative w-full h-80">
        <Image src={food.url} layout="fill"></Image>
      </div>

      <div className="bg-EEE-color py-6 px-3 rounded-b-3xl">
        <h2 className="line-clamp-1 font-bold text-3xl block text-left">
          {food.title}
        </h2>
        <div className="flex justify-between mt-2">
          <ul className="flex">
            <li className="mr-1">
              <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
            </li>
            <li className="mr-1">
              <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
            </li>
            <li className="mr-1">
              <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
            </li>
            <li className="mr-1">
              <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
            </li>
            <li className="mr-1">
              <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
            </li>
          </ul>

          <h2 className="font-bold text-xl">Sold: {food.id}</h2>
        </div>

        <h2 className="font-bold text-3xl mt-2 text-price-color text-left">
          {food.id} USD
        </h2>
      </div>
    </div>
  );
}

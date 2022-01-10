import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Rate from "rc-rate";
import "rc-rate/assets/index.css";
import Link from "next/link";
import { currencyFormat } from "../lib/format";
import { avgStars } from "../lib/format";
export default function Food({ food }) {
  const [avgStar, setAvgStar] = useState(avgStars(food));
  // console.log(food);
  return (
    <Link href={"/menu/" + food.slug}>
      <a className="col-span-3">
        <div className="relative w-full h-80">
          <Image src={food.images?.[0].url} layout="fill"></Image>
        </div>

        <div className="bg-EEE-color py-6 px-3 rounded-b-3xl">
          <h2 className="line-clamp-1 font-bold text-3xl block text-left">
            {food.name}
          </h2>
          <div className="flex justify-between mt-2 items-center">
            {/* <ul className="flex">
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
          </ul> */}
            <Rate
              style={{ fontSize: 30 }}
              className="user-rate"
              defaultValue={avgStar > 0 ? avgStar : 0}
              allowHalf
              character={<FontAwesomeIcon icon={faStar} />}
              disabled={true}
            />
            <h2 className="font-bold text-xl">Sold: {food.sold}</h2>
          </div>

          <h2 className="font-bold text-3xl mt-2 text-price-color text-left">
            {currencyFormat(food.prices)}
          </h2>
        </div>
      </a>
    </Link>
  );
}

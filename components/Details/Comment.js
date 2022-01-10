import React from "react";
import Image from "next/image";
import Rate from "rc-rate";
import "rc-rate/assets/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function Comment({ comment }) {
  return (
    <li className="flex items-center p-6 mb-10 border border-border-color">
      <div className="w-24 h-24 relative ">
        <Image
          src={
            comment.user.avatarUrl
              ? comment.user.avatarUrl
              : "/assets/img/example.png"
          }
          layout="fill"
          className="rounded-full"
        ></Image>
      </div>

      <div className="w-60 text-left ml-12">
        <p className="truncate">{comment.user.username}</p>
        <Rate
          defaultValue={comment.stars}
          className="user-rate"
          allowHalf
          character={<FontAwesomeIcon icon={faStar} />}
          disabled={true}
        />
      </div>
      <div className="flex-1 ml-12">{comment.value}</div>
    </li>
  );
}

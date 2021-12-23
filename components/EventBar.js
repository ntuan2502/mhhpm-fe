import React from "react";
import Image from "next/image";
import { Component } from "react/cjs/react.development";
import Script from "next/script";
export default function EventBar() {
  return (
    <>
      <div className=" w-full m-auto overflow-x-auto no-scrollbar bg-event-color flex py-10 justify-center">
        {/* <div className="child  justify-center no-scrollbar flex overflow-x-auto py-10"> */}
        <div className="relative mr-10 event-image ">
          <Image
            src={"/assets/img/special1.png"}
            layout="fill"
            draggable="false"
            // priority="true"
          ></Image>
        </div>

        <div className="relative mr-10 event-image">
          <Image
            src={"/assets/img/special2.png"}
            layout="fill"
            draggable="false"
          ></Image>
        </div>

        <div className="relative event-image">
          <Image
            src={"/assets/img/special3.png"}
            layout="fill"
            draggable="false"
          ></Image>
        </div>
        {/* </div> */}
      </div>

      {/* <Script src="/assets/javascript/custom.js"></Script> */}
    </>
  );
}

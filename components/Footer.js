import {
  faMapMarker,
  faPhone,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Link from "next/link";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

export default function Footer() {
  return (
    <footer className="w-full  footer__text--bg  ">
      <a
        href="#"
        className="text-white bg-black font-Harlow_Solid_Italic w-full h-28 flex items-center justify-center text-3xl"
      >
        Back to top
      </a>

      <div className=" container grid grid-cols-12 gap-5 m-auto h-80 py-7  font-Kulim_Park_Normal footer__text--color">
        <div className="col-span-3 px-12">
          <h1 className="font-bold text-2xl mb-5 text-black">EzOrder</h1>
          <p className="mb-5">
            Worldwide furniture store since 2020. We sell over 1000+ branded
            products on our website
          </p>
          <span className="flex mb-4">
            <FontAwesomeIcon icon={faMapMarker} className=""></FontAwesomeIcon>
            <p className="ml-5 flex-1">Sawojajar Malang, Vietnam</p>
          </span>

          <span className="flex mb-5">
            <FontAwesomeIcon icon={faPhoneAlt}></FontAwesomeIcon>
            <p className="ml-4 flex-1">+6289 456 3455</p>
          </span>

          <Link href="/">
            <a>www.ezorder.com</a>
          </Link>
        </div>

        <div className="col-span-2 pl-7">
          <h1 className="font-bold text-2xl mb-5 text-black">Menu</h1>
          <ul>
            <li className="mb-4">
              <Link href="#">
                <a>Products</a>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="#">
                <a>Rooms</a>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="#">
                <a>Inspirations</a>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="#">
                <a>About Us</a>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="#">
                <a>Terms & Policy</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1 ">
          <h1 className="font-bold text-2xl mb-5 text-black">Account</h1>
          <ul>
            <li className="mb-4">
              <Link href="#">
                <a>My Account</a>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="#">
                <a>Checkout</a>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="#">
                <a>My Cart</a>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="#">
                <a>My Catalog</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-3 pl-20">
          <h1 className="font-bold text-2xl mb-5 text-black">Stay Connected</h1>
          <ul>
            <li className="mb-4">
              <Link href="#">
                <a>Facebook</a>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="#">
                <a>Instagram</a>
              </Link>
            </li>

            <li className="mb-4">
              <Link href="#">
                <a>Twitter</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-3">
          <h1 className="font-bold text-2xl mb-5 text-black">Stay Updated</h1>

          <div className="flex">
            <input
              type="text"
              className="flex-1 px-4"
              placeholder="Enter your email"
            />
            <button className="btn w-11 h-11 ml-2">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="text-white"
              ></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <header className="header w-full h-60 py-6 font-Kulim_Park_Bold">
      <div className="container m-auto grid grid-cols-12 items-center gap-5 -translate-y-3 ">
        {/* logo */}

        <Link href="/">
          <a className="flex items-center col-span-2 translate-y-3 mr-auto">
            <Image src="/assets/img/Logo.png" width={158} height={172}></Image>
            {/* <h1 className="header__heading text-4xl font-bold text-red-500">
            EzOrder
          </h1> */}
          </a>
        </Link>

        {/* Nav */}
        <ul className="flex  col-span-4 ml-3  ">
          <li className="header__nav-item">
            <Link href="/">
              <a
                className={
                  currentRoute === "/"
                    ? "active header__nav-link font-bold mr-12 text-3xl"
                    : "header__nav-link font-bold mr-12 text-3xl"
                }
              >
                Home
              </a>
            </Link>
          </li>
          <li className="header__nav-item">
            <Link href="/menu">
              <a
                className={
                  currentRoute.includes("/menu")
                    ? "active header__nav-link font-bold mr-12 text-3xl"
                    : "header__nav-link font-bold mr-12 text-3xl"
                }
              >
                Menu
              </a>
            </Link>
          </li>

          <li className="header__nav-item">
            <Link href="/about">
              <a
                className={
                  currentRoute === "/about"
                    ? "active header__nav-link font-bold mr-12 text-3xl"
                    : "header__nav-link font-bold mr-12 text-3xl"
                }
              >
                About us
              </a>
            </Link>
          </li>
        </ul>

        {/* Search */}
        <div className="h-14 bg-white pl-4  rounded-lg flex items-center  col-span-4 ml-3 ">
          <FontAwesomeIcon
            icon={faSearch}
            className="text-3xl search-icon"
          ></FontAwesomeIcon>
          <input
            type="text"
            className="flex-1 border-none outline-none ml-5 text-xl truncate"
            placeholder="Search everything here ..."
            onFocus={() => {
              document.querySelector(".search-icon").classList.toggle("hide");
              document.querySelector(".search-button").classList.toggle("hide");
            }}
            onBlur={() => {
              document.querySelector(".search-icon").classList.toggle("hide");
              document.querySelector(".search-button").classList.toggle("hide");
            }}
          />

          <button className="justify-end h-full px-4 bg-category-color text-white search-button hide">
            Search
          </button>
        </div>

        {/* Profile */}

        <div className="flex items-center text-3xl col-span-2 ml-auto">
          <FontAwesomeIcon
            icon={faHeart}
            className="cursor-pointer"
          ></FontAwesomeIcon>

          <Link href="/cart">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="ml-8 cursor-pointer"
            ></FontAwesomeIcon>
          </Link>

          <span className="w-10 h-10 ml-8">
            {session ? (
              <Image
                src={session.user.image}
                width="100%"
                height="100%"
                className="rounded-full cursor-pointer"
                onClick={() => signOut()}
              />
            ) : (
              <Image
                src="/assets/img/user-icon.png"
                width="100%"
                height="100%"
                className="rounded-full cursor-pointer"
                onClick={() => {
                  router.push("/login");
                }}
              />
            )}
          </span>
        </div>
      </div>
    </header>
  );
}

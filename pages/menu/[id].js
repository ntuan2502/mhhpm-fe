// Import-----------------------------
import React, { useState } from "react";
import { useRouter } from "next/router";
import EventBar from "./../../components/EventBar";
import axios from "axios";
import Image from "next/image";
import Rate from "rc-rate";
import "rc-rate/assets/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faStar,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import qs from "query-string";

import Comment from "./../../components/Details/Comment";
import { useEffect } from "react";
import Pagination from "react-js-pagination";

// Fetch data--------------------------------------
export const getStaticPaths = async () => {
  const res = await axios.get(
    "https://jsonplaceholder.typicode.com/photos?_limit=100"
  );

  const paths = res.data.map((food) => {
    return {
      params: { id: food.id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const res = await axios.get(
    "https://jsonplaceholder.typicode.com/photos/" + id
  );

  const res2 = await axios.get(
    "https://jsonplaceholder.typicode.com/comments?postId=" + id
  );

  return {
    props: { food: res.data, comments: res2.data },
  };
};

// Client Side-----------------------------------

export default function Details({ food, comments }) {
  // Variable
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [currentComments, setCurrentComments] = useState([]);
  const [commentsTotalCount, setCommentsTotalCount] = useState(comments.length);
  const [activeCommentsPage, setActiveCommentsPage] = useState(1);
  const itemsPerPage = 3;

  // Function-------------------------------
  useEffect(() => {
    setCurrentComments(comments.slice(0, itemsPerPage));
  }, []);

  useEffect(async () => {
    // Fetch items from another resources.
    const itemOffSet = (activeCommentsPage - 1) * itemsPerPage;

    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/comments?postId=${food.id}&_start=${itemOffSet}&_limit=${itemsPerPage}`
    );
    const data = await res.data;
    setCurrentComments(data);
  }, [activeCommentsPage]);

  const IncreaseQuantity = () => {
    // if (quantity === food.stock)
    //   return;

    const temp = quantity + 1;
    setQuantity(temp);
  };

  const DecreaseQuantity = () => {
    if (quantity === 1) return;

    const temp = quantity - 1;
    setQuantity(temp);
  };

  // Invoke when user click to request another page.
  const handlePageChange = (page) => {
    const queryParams = qs.parse(location.search);
    queryParams.page = page;
    router.push(`/menu/${food.id}` + qs.stringify(queryParams), undefined, {
      shallow: true,
    });
    setActiveCommentsPage(page);
  };
  // Render
  return (
    <>
      <EventBar></EventBar>
      <div className="bg-gradient-to-b from-active-button-color font-Kulim_Park_Normal text-3xl py-6">
        <div className="container mx-auto">
          <span className="flex mb-6">
            <p className="mr-6">Home &gt;</p>
            <p className="mr-6">Popular &gt;</p>
            <p className="font-bold">{food.id}</p>
          </span>

          <div className=" bg-white p-12 rounded-3xl mb-10">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-6">
                <Image
                  src="/assets/img/bus.png"
                  width={550}
                  height={666}
                ></Image>
              </div>
              <div className="col-span-6 flex flex-col ">
                <div className="flex justify-end">
                  <Rate
                    defaultValue={5}
                    style={{ fontSize: 45 }}
                    allowHalf
                    character={
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-active-color"
                      />
                    }
                    disabled={true}
                  />
                </div>

                <div className="mr-12 mt-6">
                  <h1 className=" font-Haettenschweiler text-7xl text-center text-product-title-color">
                    {food.title}
                  </h1>

                  <h2 className="font-bold text-4xl text-normal-button-color mt-24">
                    Sold: {food.id}
                  </h2>

                  <h2 className="mt-16 font-bold text-4xl ">
                    Material:{" "}
                    <p className="font-normal inline-block">
                      beef, egg, sandwich
                    </p>
                  </h2>

                  <span className="flex justify-between mt-16">
                    <h2 className=" font-bold text-4xl ">Quantity:</h2>
                    <div className="flex w-50 align-i">
                      <span
                        className={
                          quantity === 1
                            ? "w-10 h-10 border-black border-2 rounded-full text-center select-none box-border"
                            : "w-10 h-10 border-black border-2 rounded-full  text-center select-none cursor-pointer  "
                        }
                        onClick={() => DecreaseQuantity()}
                      >
                        -
                      </span>
                      <input
                        type="text"
                        className="w-24 text-center mx-2 bg-white"
                        disabled
                        value={quantity}
                      />
                      <span
                        className={
                          quantity === 14
                            ? "w-10 h-10 bg-active-button-color text-white rounded-full select-none px-3 "
                            : "w-10 h-10 bg-active-button-color text-white rounded-full select-none px-3 cursor-pointer  "
                        }
                        onClick={() => IncreaseQuantity()}
                      >
                        +
                      </span>
                    </div>
                  </span>

                  <span className="text-5xl font-bold text-price-color flex justify-end mr-8 mt-16">
                    {food.id} USD
                  </span>

                  <button className="bg-cart-button-color text-white w-full py-8 font-bold text-4xl my-16 rounded-xl text-center">
                    Add cart{" "}
                    <FontAwesomeIcon icon={faShoppingCart}></FontAwesomeIcon>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 text-4xl mt-10">
              <div className="col-span-3">
                <p className="product-label">Origin</p>
                <p className="product-label">Type</p>
                <p className="product-label">Material</p>
              </div>
              <div className="col-span-9">
                <p className="product-info">Vietnam</p>
                <p className="product-info">Food</p>
                <p className="product-info">beef, egg, sandwich</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-3xl">
            <ul>
              {currentComments.map((comment) => (
                <Comment comment={comment}></Comment>
              ))}
            </ul>
          </div>

          <Pagination
            activePage={activeCommentsPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={commentsTotalCount}
            pageRangeDisplayed={4}
            onChange={handlePageChange.bind(this)}
            prevPageText={
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="relative right-0.5"
              />
            }
            nextPageText={
              <FontAwesomeIcon
                icon={faChevronRight}
                className="relative left-0.5"
              />
            }
            innerClass="flex justify-end mt-20 font-Kulim_Park_Normal font-bold "
            itemClass="w-pagination-button-width h-pagination-button-height bg-normal-button-color ml-6  rounded-full text-white text-3xl "
            itemClassPrev="bg-navigation-button-bg-color text-navigation-text-color"
            itemClassNext="bg-navigation-button-bg-color text-navigation-text-color"
            linkClass="block w-full h-full flex justify-center items-center"
            hideFirstLastPages={true}
            activeClass="bg-active-button-color"
          />
        </div>
      </div>
    </>
  );
}

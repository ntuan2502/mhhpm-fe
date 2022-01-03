// Import-----------------------------
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import EventBar from "../../components/EventBar";
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
import ImageGallery from "react-image-gallery";
import Comment from "../../components/Details/Comment";
import { useEffect } from "react";
import Pagination from "react-js-pagination";
import { currencyFormat } from "../../lib/format";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantityByAmount,
  addFoodsToCart,
} from "../../redux/cartManage";
// Fetch data--------------------------------------
// export const getStaticPaths = async () => {
//   const res = await axios.get(
//     "https://jsonplaceholder.typicode.com/photos?_limit=100"
//   );

//   const paths = res.data.map((food) => {
//     return {
//       params: { id: food.id.toString() },
//     };
//   });

//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticProps = async (context) => {
//   const id = context.params.id;
//   const res = await axios.get(
//     "https://jsonplaceholder.typicode.com/photos/" + id
//   );

//   const res2 = await axios.get(
//     "https://jsonplaceholder.typicode.com/comments?postId=" + id
//   );

//   return {
//     props: { food: res.data, comments: res2.data },
//   };
// };

export async function getServerSideProps(context) {
  const slug = context.params.slug;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/foods?slug=${slug}`
  );

  const res2 = await axios.get(
    "https://jsonplaceholder.typicode.com/comments?postId=1"
  );

  return {
    props: { food: res.data[0], comments: res2.data },
  };
}

// Client Side-----------------------------------

export default function Details({ food, comments }) {
  // console.log(food);
  // Variable
  const { cart } = useSelector((state) => state.cartManage);
  const dispatch = useDispatch();
  const router = useRouter();
  const ref = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [currentComments, setCurrentComments] = useState([]);
  const [commentsTotalCount, setCommentsTotalCount] = useState(comments.length);
  const [activeCommentsPage, setActiveCommentsPage] = useState(1);
  const itemsPerPage = 3;
  const [images, setImages] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(10);

  // Function-------------------------------

  const addToCart = () => {
    // const temp = Object.assign({}, cart);

    const foodDetail = { ...food };
    foodDetail.quantity = quantity;
    foodDetail.totalPrice = totalPrice;
    foodDetail.choose = false;

    dispatch(increaseQuantityByAmount(quantity));
    dispatch(addFoodsToCart(foodDetail));
    alert("Add to cart successfully");
  };

  const CalcTotalPrice = () => {
    return quantity * food.prices;
  };

  useEffect(() => {
    setTotalPrice(CalcTotalPrice());
  }, [quantity]);

  useEffect(() => {
    setCurrentComments(comments.slice(0, itemsPerPage));
    let arrImgs = [];
    food.images.map((img) => {
      arrImgs.push({
        original: img.url,
        thumbnail: img.formats.thumbnail.url,
      });
    });
    setImages(arrImgs);
  }, []);

  useEffect(async () => {
    // Fetch items from another resources.
    const itemOffSet = (activeCommentsPage - 1) * itemsPerPage;

    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/comments?postId=1&_start=${itemOffSet}&_limit=${itemsPerPage}`
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
    router.push(`/menu/${food.slug}?` + qs.stringify(queryParams), undefined, {
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
            {/* <p className="mr-6">Popular &gt;</p> */}
            <p className="font-bold">{food.name}</p>
          </span>

          <div className=" bg-white p-12 rounded-3xl mb-10">
            <div className="grid grid-cols-12 gap-5 ">
              <div className="col-span-6 bg-product-image-container-color p-4">
                <ImageGallery
                  items={images}
                  autoPlay={true}
                  slideInterval={6000}
                  slideDuration={500}
                  showPlayButton={false}
                  showBullets={true}
                  showNav={false}
                  showFullscreenButton={false}
                  ref={ref}
                  onClick={(e) => {
                    if (!isFullScreen) {
                      ref.current.fullScreen();
                      setIsFullScreen(true);
                    }
                    ref.current.exitFullScreen();
                    setIsFullScreen(false);
                  }}
                />
              </div>
              <div className="col-span-6 flex flex-col ml-8  ">
                <div className="flex justify-end">
                  <Rate
                    defaultValue={4.7}
                    style={{ fontSize: 45 }}
                    allowHalf
                    character={<FontAwesomeIcon icon={faStar} />}
                    disabled={true}
                  />
                </div>

                <div className="mr-12 mt-6">
                  <h1 className=" font-Haettenschweiler text-7xl text-center text-product-title-color">
                    {food.name}
                  </h1>

                  <h2 className="font-bold text-4xl text-normal-button-color mt-16">
                    Sold: 0
                  </h2>

                  <h2 className="mt-8 font-bold text-4xl ">
                    Material:{" "}
                    <p className="font-normal inline-block">
                      {food.tags.map((tag) => tag.name)}
                    </p>
                  </h2>

                  <span className="flex justify-between mt-8">
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

                  <span className="text-5xl font-bold text-price-color flex justify-end mr-8 mt-8">
                    {currencyFormat(totalPrice)}
                  </span>

                  <button
                    className="bg-cart-button-color text-white w-full py-8 font-bold mt-8 text-4xl  rounded-xl text-center"
                    onClick={() => addToCart()}
                  >
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
                <p className="product-info">
                  {food.tags.map((tag) => tag.name)}
                </p>
                <p className="product-info">
                  {food.tags.map((tag) => tag.name)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-3xl">
            <ul>
              {currentComments.map((comment) => (
                <Comment comment={comment} key={comment.id}></Comment>
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

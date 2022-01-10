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
import { currencyFormat, avgStars } from "../../lib/format";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantityByAmount,
  addFoodsToCart,
} from "../../redux/cartManage";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const slug = context.params.slug;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/foods?slug=${slug}`
  );
  const food = res.data[0];

  const res2 = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments?_where[food.id]=${food.id}&_sort=createdAt:DESC`
  );
  const comments = res2.data;

  const myComment = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments?_where[food.id]=${food.id}&[user.id]=${session?._user?.id}`
  );

  return {
    props: {
      food,
      comments,
      myComment: myComment.data,
      avgStar: avgStars(food),
    },
  };
}

// Client Side-----------------------------------

export default function Details({ food, comments, myComment, avgStar }) {
  // Variable
  const { data: session, status } = useSession();
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
  const [success, setSuccess] = useState(false);
  const [note, setNote] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [warningComment, setWarningComment] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(
    myComment?.length == 0 ? true : false
  );
  const commentRef = useRef();

  // Function-------------------------------

  async function handleSendComment() {
    setWarningComment(false);
    if (comment.length < 1) {
      commentRef.current.focus();
    } else if (rating == 0) {
      setWarningComment(true);
    } else {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments`,
        {
          stars: rating,
          value: comment,
          user: session?._user.id,
          food: food.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
          },
        }
      );
      // console.log(res);
      setComment("");
      setRating(0);
      toast.success("SEND COMMENT SUCCESSFULLY", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.reload();
    }
  }

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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments?_where[food.id]=${food.id}&_sort=createdAt:DESC&_start=${itemOffSet}&_limit=${itemsPerPage}`
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

  const addToCart = () => {
    // const temp = Object.assign({}, cart);
    const foodDetail = { ...food };
    foodDetail.quantity = quantity;
    foodDetail.totalPrice = totalPrice;
    foodDetail.choose = false;
    foodDetail.user_description = note;
    setNote("");
    setQuantity(1);
    dispatch(increaseQuantityByAmount(quantity));
    dispatch(addFoodsToCart(foodDetail));
    toast.success("ADD TO CART SUCCESSFULLY", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  // Render
  return (
    <>
      {/* <div className="modal fixed top-0 left-0 right-0 bottom-0 z-10">
        <div className="modal-overlay absolute w-full h-full"></div>
        <div
          className={
            success
              ? "modal-body cursor-pointer absolute w-[400px]  px-4 py-5 bg-white shadow-2xl -top-20 left-1/2 flex items-center flex-col -translate-x-1/2 -translate-y-1/2 border border-black z-10 transition-all modal-appear"
              : "modal-body cursor-pointer absolute w-[400px]  px-4 py-5 bg-white shadow-2xl -top-20 left-1/2 flex items-center flex-col -translate-x-1/2 -translate-y-1/2 border border-black z-10 transition-all"
          }
          onClick={() => {
            document
              .querySelector(".modal-body")
              .classList.toggle("modal-appear");
          }}
        >
          <Image
            src="/assets/img/checked-resize.png"
            width={80}
            height={80}
          ></Image>

          <p className="text-center font-Roboto_Bold mt-4">
            ADD TO CART SUCCESSFULLY
          </p>
        </div>
      </div> */}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <EventBar></EventBar>

      <div className="bg-gradient-to-b from-active-button-color font-Roboto_Normal text-3xl py-6">
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
                    style={{ fontSize: 45 }}
                    defaultValue={avgStar > 0 ? avgStar : 0}
                    allowHalf
                    character={<FontAwesomeIcon icon={faStar} />}
                    disabled={true}
                  />
                </div>

                <div className="mr-12 mt-6">
                  <h1 className=" font-Anton text-7xl text-center text-product-title-color leading-[80px]">
                    {food.name}
                  </h1>

                  <h2 className="font-bold text-4xl text-normal-button-color mt-16">
                    Sold: {food.sold}
                  </h2>

                  {/* <h2 className="mt-8 font-bold text-4xl ">
                    Material:{" "}
                    <p className="font-normal inline-block">
                      {food.tags.map((tag) => tag.name)}
                    </p>
                  </h2> */}

                  <span className="flex justify-between mt-8">
                    <h2 className=" font-bold text-4xl ">Quantity:</h2>
                    <div className="flex w-50">
                      <span
                        className={
                          quantity === 1
                            ? "w-10 h-10 flex items-center justify-center  border-black border-2 rounded-full text-center select-none box-border"
                            : "w-10 h-10 flex items-center justify-center border-black border-2 rounded-full  text-center select-none cursor-pointer  "
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
                            ? "w-10 h-10 flex items-center justify-center bg-active-button-color text-white rounded-full select-none px-3 "
                            : "w-10 h-10 flex items-center justify-center bg-active-button-color text-white rounded-full select-none px-3 cursor-pointer  "
                        }
                        onClick={() => IncreaseQuantity()}
                      >
                        +
                      </span>
                    </div>
                  </span>

                  <span className="text-5xl font-bold text-price-color flex justify-end mt-8">
                    {currencyFormat(totalPrice)}
                  </span>

                  <label
                    htmlFor="user_description"
                    className="font-bold text-3xl"
                  >
                    Note:
                  </label>
                  <textarea
                    name=""
                    id="user_description"
                    className="border border-black w-full h-[200px] p-4 mt-6 "
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                  ></textarea>

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
                <p className="product-label">Description</p>
              </div>
              <div className="col-span-9">
                <div className="product-info">Vietnam</div>
                <div className="product-info flex">
                  {food.tags.map((tag, index) => (
                    <div className="mr-2" key={index}>
                      {tag.name}
                      {food.tags.length - 1 == index ? "" : ","}
                    </div>
                  ))}
                </div>
                <div className="product-info">{food.description}</div>
              </div>
            </div>
          </div>
          <div className="bg-white px-12 py-6 rounded-3xl">
            {status === "unauthenticated" ? (
              <div className="flex justify-center items-center mb-12">
                Vui lòng
                <div className="mx-2 text-blue-500">
                  <Link href={"/login"}>đăng nhập</Link>
                </div>
                để gửi đánh giá
              </div>
            ) : showCommentBox ? (
              <div className="flex pb-6 pl-6">
                <div className="flex items-center w-1/3">
                  <img
                    className="rounded-full h-24 mr-10"
                    src={session?.user?.image}
                    alt=""
                  />
                  <div className="mx-2">
                    <div className="flex justify-center items-center">
                      {session?.user?.name}
                    </div>
                    <div
                      className={`${
                        warningComment ? "border-b-4 border-red-500" : ""
                      } w-max`}
                    >
                      <Rate
                        // defaultValue={rating}
                        onChange={(new_rating) => {
                          if (new_rating > 0) {
                            setWarningComment(false);
                          }
                          setRating(new_rating);
                        }}
                        className="user-rate"
                        allowHalf={false}
                        character={<FontAwesomeIcon icon={faStar} />}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-2/3">
                  <div className="relative">
                    <textarea
                      className="border border-black rounded-lg w-full h-[200px] p-4 mt-6"
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                      ref={commentRef}
                      placeholder="Type your comment here"
                    />

                    <div className="absolute bottom-1 right-3">
                      <button
                        type="button"
                        onClick={() => handleSendComment()}
                        className="bg-blue-500 px-5 py-2 my-4 rounded overflow-hidden focus:outline-none focus:shadow-outline transition ease-out duration-200 bg-teal-400 hover:bg-teal-500 text-white text-2xl"
                      >
                        Gửi đánh giá
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center mb-6 text-blue-500">
                Bạn đã gửi đánh giá rồi!
              </div>
            )}

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
            innerClass="flex justify-end mt-20 font-Roboto_Normal font-bold "
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

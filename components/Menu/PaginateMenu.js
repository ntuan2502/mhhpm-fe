import React from "react";

import Food from "./../Food";
import Pagination from "react-js-pagination";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import qs from "query-string";
export default function PaginateMenu({
  tagsName,
  categories,
  foods,
  itemsPerPage,
  totalCount,
  activeCategoryProp,
  keyword,
}) {
  const [currentItems, setCurrentItems] = useState(foods);
  const [activePage, setActivePage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(activeCategoryProp);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(totalCount);
  const router = useRouter();

  useEffect(async () => {
    const search = window.location.search;
    const categoryQuery = new URLSearchParams(search).get("category");
    const pageQuery = new URLSearchParams(search).get("page");
    if (categoryQuery !== null) {
      setActiveCategory(categoryQuery);
    }
    if (pageQuery !== null) {
      // console.log(pageQuery);
      setActivePage(parseInt(pageQuery));
    }
  }, []);

  const changeCategory = async (category, index) => {
    // fetch
    // ----------------------
    // window.location = "/menu?category=" + category;
    router.push("/menu?category=" + category, undefined, { shallow: true });

    setActiveCategory(category);
    setLoading(true);
    const res = await axios.get(`/api/tags?slug=${category}`);
    setCurrentItems(res.data.foods);
    setActivePage(1);
    setTotalItems(res.data.totalCount);
    setLoading(false);
  };

  const fetchDataAgain = async (page) => {
    const itemOffSet = (page - 1) * itemsPerPage;
    console.log(keyword);
    let res;
    if (keyword === null || keyword === undefined) {
      const container = document.querySelector(".categories");
      const offsetTop = container.offsetTop;
      console.log(offsetTop);
      window.scrollTo(0, offsetTop);
      setLoading(true);
      res = await axios.get(
        `/api/tags?slug=${activeCategory}&start=${itemOffSet}&limit=${itemsPerPage}`
      );
    } else {
      const container = document.querySelector(".search-heading");
      const offsetTop = container.offsetTop;

      window.scrollTo(0, offsetTop);
      setLoading(true);
      res = await axios.get(
        `/api/search?keyword=${keyword}&start=${itemOffSet}&limit=${itemsPerPage}`
      );
    }

    const data = await res.data;
    setCurrentItems(data.foods);

    setLoading(false);
  };
  // console.log(currentItems);

  // Invoke when user click to request another page.
  const handlePageChange = (page) => {
    const queryParams = qs.parse(location.search);
    queryParams.page = page;
    if (keyword === null || keyword === undefined) {
      router.push("/menu?" + qs.stringify(queryParams), undefined, {
        shallow: true,
      });
    } else {
      router.push("/search?" + qs.stringify(queryParams), undefined, {
        shallow: true,
      });
    }

    setActivePage(page);
    fetchDataAgain(page);
  };

  return (
    <div className="container mx-auto my-16 min-h-[1750px]">
      {categories && (
        <ul className="bg-category-color w-full h-32 rounded-xl flex items-center px-20 categories">
          {categories.map((category, index) => (
            <li key={index}>
              <a
                onClick={() => changeCategory(category, index)}
                className={
                  category === activeCategory
                    ? "text-active-color text-3xl font-bold mr-10 cursor-pointer"
                    : " text-3xl font-bold mr-10 text-white cursor-pointer"
                }
              >
                {tagsName[index]}
              </a>
            </li>
          ))}
        </ul>
      )}

      {!categories && (
        <h1 className="text-center text-4xl font-bold search-heading">
          SEARCH RESULT
        </h1>
      )}

      {loading ? (
        <h1 className="text-center text-4xl font-bold mt-8">Loading...</h1>
      ) : (
        <div className="grid grid-cols-12 gap-5 mt-8  ">
          {currentItems &&
            currentItems.map((food) => (
              <Food food={food} key={food.id} activeCategory={activeCategory} />
            ))}
        </div>
      )}

      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={totalItems}
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
  );
}

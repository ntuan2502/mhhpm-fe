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
}) {
  const [currentItems, setCurrentItems] = useState(foods[0].foods);
  const [activePage, setActivePage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(activeCategoryProp);
  const router = useRouter();

  useEffect(async () => {
    const search = window.location.search;
    const categoryQuery = new URLSearchParams(search).get("category");
    const pageQuery = new URLSearchParams(search).get("page");
    if (categoryQuery !== null) {
      setActiveCategory(categoryQuery);
    }
    if (pageQuery !== null) {
      console.log(pageQuery);
      setActivePage(parseInt(pageQuery));
    }
  }, []);

  const changeCategory = async (category, index) => {
    // fetch
    // ----------------------
    window.location = "/menu?category=" + category;
  };

  useEffect(async () => {
    // Fetch items from another resources.
    const itemOffSet = (activePage - 1) * itemsPerPage;

    const res = await axios.get(
      `/api/tags?slug=${activeCategory}&start=${itemOffSet}&limit=${itemsPerPage}`
    );
    const data = await res.data;
    setCurrentItems(data);
  }, [activePage]);

  // Invoke when user click to request another page.
  const handlePageChange = (page) => {
    const queryParams = qs.parse(location.search);
    queryParams.page = page;
    router.push("/menu?" + qs.stringify(queryParams), undefined, {
      shallow: true,
    });

    setActivePage(page);
    const container = document.querySelector(".bg-category-color");
    const offsetTop = container.offsetTop;
    window.scrollTo(0, offsetTop);
  };

  return (
    <div className="container mx-auto my-16">
      <ul className="bg-category-color w-full h-32 rounded-xl flex items-center px-20">
        {categories &&
          categories.map((category, index) => (
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

      <div className="grid grid-cols-12 gap-5 mt-8  ">
        
        {/* {currentItems &&
          currentItems.map((food) => (
            <Food food={food} key={food.id} activeCategory={activeCategory} />
          ))} */}
      </div>

      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={totalCount}
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
  );
}

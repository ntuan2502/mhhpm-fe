import React from "react";
import EventBar from "./../../components/EventBar";
import PaginateMenu from "./../../components/Menu/PaginateMenu";

import axios from "axios";

export const getServerSideProps = async (context) => {
  // const res = await axios.get("https://fakestoreapi.com/products/categories");
  const data = ["Popular", "Food", "Drink", "Vegetable", "Fruit"];
  let activeCategory = data[0];
  if (context.query.category !== null && context.query.category !== undefined)
    activeCategory = context.query.category;
  console.log(activeCategory);
  const res2 = await axios.get(
    `https://jsonplaceholder.typicode.com/photos?category=${activeCategory}&_limit=100`
  );
  const totalCount = await res2.data.length;
  const data2 = await res2.data.slice(0, 11);

  // console.log(data);
  return {
    props: {
      categories: data,
      foods: data2,
      totalCount: totalCount,
      activeCategoryProp: activeCategory,
    },
  };
};

export default function Menu({
  categories,
  foods,
  totalCount,
  activeCategoryProp,
}) {
  return (
    <div className="font-Kulim_Park_Normal">
      <EventBar></EventBar>
      <PaginateMenu
        categories={categories}
        foods={foods}
        itemsPerPage={12}
        totalCount={totalCount}
        activeCategoryProp={activeCategoryProp}
      ></PaginateMenu>
    </div>
  );
}

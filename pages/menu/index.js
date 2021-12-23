import React from "react";
import EventBar from "./../../components/EventBar";
import PaginateMenu from "./../../components/Menu/PaginateMenu";
import axios from "axios";
export const getStaticProps = async () => {
  // const res = await axios.get("https://fakestoreapi.com/products/categories");
  const data = ["Popular", "Food", "Drink", "Vegetable", "Fruit"];

  const res2 = await axios.get(
    "https://jsonplaceholder.typicode.com/photos?_limit=100"
  );
  const totalCount = await res2.data.length;
  const data2 = await res2.data.slice(0, 11);

  // console.log(data);
  return {
    props: { categories: data, foods: data2, totalCount: totalCount },
  };
};

export default function Menu({ categories, foods, totalCount }) {
  return (
    <div className="font-Kulim_Park_Normal">
      <EventBar></EventBar>
      <PaginateMenu
        categories={categories}
        foods={foods}
        itemsPerPage={12}
        totalCount={totalCount}
      ></PaginateMenu>
    </div>
  );
}

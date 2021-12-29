import React from "react";
import EventBar from "./../../components/EventBar";
import PaginateMenu from "./../../components/Menu/PaginateMenu";
import { limit } from "../../config/setting";
import axios from "axios";

export const getServerSideProps = async (context) => {
  // const res = await axios.get("https://fakestoreapi.com/products/categories");
  const tagsData = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tags`
  );
  const tags = await tagsData.data;
  const data = [];
  const tagsName = [];
  tags.map((tag) => {
    data.push(tag.slug);
    tagsName.push(tag.name);
  });

  // const data = ["Popular", "Food", "Drink", "Vegetable", "Fruit"];
  let activeCategory = data[0];
  if (context.query.category !== null && context.query.category !== undefined)
    activeCategory = context.query.category;
  // console.log(activeCategory);
  const res2 = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tags?_slug=${activeCategory}`
  );
  const totalCount = await res2.data[0].foods.length;
  const data2 = await res2.data[0].foods.slice(0, limit - 1);

  // console.log(data2);
  return {
    props: {
      tagsName: tagsName,
      categories: data,
      foods: data2,
      totalCount: totalCount,
      activeCategoryProp: activeCategory,
    },
  };
};

export default function Menu({
  tagsName,
  categories,
  foods,
  totalCount,
  activeCategoryProp,
}) {
  return (
    <div className="font-Kulim_Park_Normal">
      <EventBar></EventBar>
      <PaginateMenu
        tagsName={tagsName}
        categories={categories}
        foods={foods}
        itemsPerPage={limit()}
        totalCount={totalCount}
        activeCategoryProp={activeCategoryProp}
      ></PaginateMenu>
    </div>
  );
}

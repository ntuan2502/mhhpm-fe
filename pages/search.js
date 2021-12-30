import React, { useEffect, useState } from "react";
import EventBar from "./../components/EventBar";
import PaginateMenu from "./../components/Menu/PaginateMenu";

import axios from "axios";
import { limit } from "../config/setting";

export const getServerSideProps = async (context) => {
  const keyword = context.query.keyword
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
  console.log(keyword);
  const res = await axios.get(
    ` ${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/search?keyword=${keyword}`
  );
  const data = res.data.foods;
  const totalCount = await res.data.totalCount;
  console.log(totalCount);

  return {
    props: { foods: data, totalCount: totalCount, keyword: keyword },
    // props: {abc:abc}
  };
};
export default function search({ foods, totalCount, keyword }) {
  // console.log(foods);

  return (
    <>
      <EventBar />

      <h1 className="text-center text-4xl font-bold mt-4">SEARCH RESULT</h1>

      {foods.length !== 0 && (
        <PaginateMenu
          foods={foods}
          itemsPerPage={limit()}
          totalCount={totalCount}
          keyword={keyword}
        ></PaginateMenu>
      )}

      {foods.length === 0 && (
        <h2 className="text-center text-4xl font-bold my-8">No food found</h2>
      )}
    </>
  );
}

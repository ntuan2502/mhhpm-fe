import React from "react";
import EventBar from "./../components/EventBar";
import PaginateMenu from "./../components/Menu/PaginateMenu";

import axios from "axios";

export const getServerSideProps = async (context) => {
  const keyword = context.query.keyword;

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?_keyword=${keyword}`
  );
  const data = res.data;

  return {
    props: { foods: data },
  };
};
export default function search() {
  return <></>;
}

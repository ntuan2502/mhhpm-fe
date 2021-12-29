import React from "react";
import { useState } from "react";
import Food from "../Food";
import axios from "axios";
export default function ScrollMenu({ foods }) {
  const [props, setProps] = useState(foods);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const fetchMoreData = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/foods?_start=${props.length}&_limit=8`
    );
    const data = await res.data;
    if (data.length <= 0) {
      setHasMore(false);
    }
    setLoading(false);
    setProps((props) => [...props, ...data]);
  };

  return (
    <div className="container m-auto font-Kulim_Park_Normal text-center flex flex-col items-center mb-20">
      <h1 className="text-center text-4xl font-bold">HOT CHOICES</h1>
      <div className="grid grid-cols-12 gap-5 my-12 ">
        {props.map((prop) => (
          <Food food={prop} key={prop.id} />
        ))}
      </div>

      {loading && <h1 className="text-3xl font-bold mb-4">Loading...</h1>}

      {!hasMore && (
        <h1 className="text-3xl font-bold">This is end of the list</h1>
      )}

      {hasMore && (
        <span
          onClick={fetchMoreData}
          className="border-primary-color border-2 w-80 h-14 flex items-center justify-center text-primary-color font-bold text-3xl cursor-pointer"
        >
          Show more
        </span>
      )}
    </div>
  );
}

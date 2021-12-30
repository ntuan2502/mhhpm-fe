import axios from "axios";
import { limit } from "../../config/setting";

export default async function searchAPI(req, res, next) {
  const keyword = req.query.keyword;
  const _start = parseInt(req.query.start ?? 0); //0, 12, 24, 36
  const _limit = parseInt(req.query.limit ?? limit()); //12
  const _end = parseInt(_limit + _start); //12, 24, 36

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/foods`
  );
  const data = await response.data.filter((item) =>
    item.slug.includes(keyword.toString())
  );
  const totalCount = data.length;

  const foods = data.slice(_start, _end);
  console.log(foods.length);

  res.status(200).json({ foods: foods, totalCount: totalCount });
}
